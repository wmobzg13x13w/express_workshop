const mongoose = require("mongoose");

const quizSchema = mongoose.Schema({
  question: { type: String, required: true },
  answers: { type: [String], required: true },
  correctAnswer: { type: Number, required: true },
});

module.exports = mongoose.model("Quiz", quizSchema);
