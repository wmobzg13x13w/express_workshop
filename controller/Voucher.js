const User = require("../model/User");
const Voucher = require("../model/Voucher");

const nodemailer = require("nodemailer");

const generateUniqueVoucherCode = () => {
  return Math.random().toString(36).substring(2, 15);
};
exports.createVouchers = async (req, res) => {
  try {
    const { studentEmails } = req.body;

    if (
      !studentEmails ||
      !Array.isArray(studentEmails) ||
      studentEmails.length === 0
    ) {
      return res.status(400).json({ message: "Student emails are required" });
    }

    const vouchers = [];
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.email,
        pass: process.env.pass,
      },
    });

    // Generate vouchers and send emails
    for (const email of studentEmails) {
      const voucherCode = generateUniqueVoucherCode();

      const voucher = new Voucher({
        code: voucherCode,
        associatedEmail: email,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      });

      await voucher.save();
      vouchers.push(voucher);

      // Send email to the student
      await transporter.sendMail({
        from: process.env.email,
        to: email,
        subject: "Your Voucher Code for the Quiz",
        text: `Dear Student,\n\nYour voucher code is: ${voucherCode}. Use this code to access your quiz.\n\nBest regards,\nYour Professor`,
      });
    }

    res
      .status(201)
      .json({ message: "Vouchers created and sent successfully", vouchers });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error creating vouchers", error });
  }
};

exports.redeemVoucher = async (req, res) => {
  try {
    const { voucherCode, studentEmail } = req.body;

    const voucher = await Voucher.findOne({
      code: voucherCode,
      isRedeemed: false,
    });
    if (!voucher) {
      return res
        .status(400)
        .json({ message: "Invalid or already redeemed voucher" });
    }

    if (voucher.associatedEmail !== studentEmail) {
      return res
        .status(403)
        .json({ message: "Unauthorized: This voucher is not assigned to you" });
    }

    const student = await User.findOne({
      studentEmail,
    });
    if (new Date() > voucher.expiresAt) {
      return res.status(400).json({ message: "Voucher has expired" });
    }

    voucher.isRedeemed = true;
    await voucher.save();

    const quizzes = await Quiz.aggregate([{ $sample: { size: 3 } }]);

    const newExam = new Exam({
      studentId: student._id,
      quizzes: quizzes.map((quiz) => quiz._id),
    });

    await newExam.save();

    res
      .status(200)
      .json({ message: "Voucher redeemed successfully", exam: newExam });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error redeeming voucher", error });
  }
};
