const express = require("express");
const router = express.Router();
const authenticateProfessor = require("../middleware/authenticateProfessor");
const authenticateStudent = require("../middleware/authenticateStudent");
const {
  requestExam,
  evaluateExam,
  submitVoucher,
} = require("../controller/Exam");

router.post("/request-exam", requestExam);
router.post("/submit-voucher", submitVoucher);
router.post("/evaluate-exam", evaluateExam);
module.exports = router;
