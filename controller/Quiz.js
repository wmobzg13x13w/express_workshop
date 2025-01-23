const Quiz = require("../model/Quiz");
exports.createQuiz = async (req, res) => {
  const { question, answers, correctAnswer } = req.body;

  if (!question || !answers || !correctAnswer) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    const newQuiz = new Quiz({
      question,
      answers,
      correctAnswer,
    });

    const savedQuiz = await newQuiz.save();

    res.status(201).json(savedQuiz);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getAllQuizzes = async (req, res) => {
  try {
    const quizzes = await Quiz.find();
    res.status(200).json(quizzes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getQuizById = async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.id);
    if (!quiz) {
      return res.status(404).json({ message: "Quiz not found" });
    }
    res.status(200).json(quiz);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateQuiz = async (req, res) => {
  const { question, answers, correctAnswer } = req.body;

  if (!question || !answers || !correctAnswer) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    const updatedQuiz = await Quiz.findByIdAndUpdate(
      req.params.id,
      { question, answers, correctAnswer },
      { new: true }
    );

    if (!updatedQuiz) {
      return res.status(404).json({ message: "Quiz not found" });
    }

    res.status(200).json(updatedQuiz);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteQuiz = async (req, res) => {
  try {
    const deletedQuiz = await Quiz.findByIdAndDelete(req.params.id);
    if (!deletedQuiz) {
      return res.status(404).json({ message: "Quiz not found" });
    }
    res.status(200).json({ message: "Quiz deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
