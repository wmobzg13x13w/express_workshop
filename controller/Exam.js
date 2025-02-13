const Exam = require("../model/Exam");

exports.submitExam = async (req, res) => {
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
    res.status(500).json({ message: "Error submitting exam", error });
  }
};

exports.evaluateExam = async (req, res) => {
  try {
    const { examId } = req.body;

    const exam = await Exam.findById(examId).populate("quizzes");
    if (!exam) {
      return res.status(404).json({ message: "Exam not found" });
    }

    res.status(200).json({ score: exam.score, total: exam.quizzes.length });
  } catch (error) {
    res.status(500).json({ message: "Error evaluating exam", error });
  }
};
