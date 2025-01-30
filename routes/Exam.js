const express = require("express");
const router = express.Router();
const { submitExam, evaluateExam } = require("../controller/Exam");
const authenticateProfessor = require("../middleware/authenticateProfessor");
const authenticateStudent = require("../middleware/authenticateStudent");

router.post("/submit-exam", authenticateStudent, submitExam);
router.post("/evaluate-exam", evaluateExam);

module.exports = router;
