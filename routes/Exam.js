const express = require("express");
const router = express.Router();
const authenticateProfessor = require("../middleware/authenticateProfessor");
const authenticateStudent = require("../middleware/authenticateStudent");
const { requestExam, evaluateExam, createExam } = require("../controller/Exam");

router.post("/request-exam", authenticateStudent, requestExam);
router.post("/create-exam", authenticateStudent, createExam);
router.post("/evaluate-exam", authenticateStudent, evaluateExam);
module.exports = router;
