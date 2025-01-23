const mongoose = require("mongoose");

const examSchema = mongoose.Schema({
  quizzes: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: "Quiz",
    required: true,
  },
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  score: { type: Number, default: 0 },
});

module.exports = mongoose.model("Exam", examSchema);
