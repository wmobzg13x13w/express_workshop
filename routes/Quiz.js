const express = require("express");
const router = express.Router();
const { createQuiz } = require("../controller/Quiz");
const authenticateProfessor = require("../middleware/authenticateProfessor");

router.post("/add", authenticateProfessor, createQuiz);

module.exports = router;
