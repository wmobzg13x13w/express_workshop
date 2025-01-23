const Voucher = require("../model/Voucher");
const Quiz = require("../model/Quiz");
const Exam = require("../model/Exam");
const nodemailer = require("nodemailer");
const User = require("../model/User");

const generateUniqueVoucherCode = () => {
  return Math.random().toString(36).substring(2, 15);
};

const sendEmail = async (email, voucherCode) => {
  let transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.email,
      pass: process.env.pass,
    },
  });

  let mailOptions = {
    from: process.env.email,
    to: email,
    subject: "Your Exam Voucher",
    text: `Your voucher code is: ${voucherCode}`,
  };

  await transporter.sendMail(mailOptions);
};

exports.requestExam = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const voucherCode = generateUniqueVoucherCode();

    const newVoucher = new Voucher({
      code: voucherCode,
    });

    await newVoucher.save();

    await sendEmail(email, voucherCode);

    res.status(200).json({ message: "Voucher sent to email" });
  } catch (error) {
    res.status(500).json({ message: "Error requesting exam", error });
  }
};

exports.submitVoucher = async (req, res) => {
  try {
    const { voucherCode, studentId } = req.body;

    const voucher = await Voucher.findOne({
      code: voucherCode,
      isRedeemed: false,
    });
    if (!voucher) {
      return res
        .status(400)
        .json({ message: "Invalid or already redeemed voucher" });
    }

    const quizzes = await Quiz.aggregate([{ $sample: { size: 3 } }]);

    const newExam = new Exam({
      studentId,
      quizzes: quizzes.map((quiz) => quiz._id),
    });

    await newExam.save();

    voucher.isRedeemed = true;
    await voucher.save();

    res.status(200).json(newExam);
  } catch (error) {
    res.status(500).json({ message: "Error submitting voucher", error });
  }
};

exports.evaluateExam = async (req, res) => {
  try {
    const { examId, responses } = req.body;

    const exam = await Exam.findById(examId).populate("quizzes");
    if (!exam) {
      return res.status(404).json({ message: "Exam not found" });
    }

    let score = 0;

    exam.quizzes.forEach((quiz, index) => {
      if (quiz.correctAnswer === responses[index]) {
        score += 1;
      }
    });

    exam.score = score;
    await exam.save();

    res.status(200).json({ score, total: exam.quizzes.length });
  } catch (error) {
    res.status(500).json({ message: "Error evaluating exam", error });
  }
};
