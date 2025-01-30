const express = require("express");
const router = express.Router();
const { createVouchers, redeemVoucher } = require("../controller/Voucher");
const authenticateProfessor = require("../middleware/authenticateProfessor");
const authenticateStudent = require("../middleware/authenticateStudent");

router.post("/create-vouchers", authenticateProfessor, createVouchers);

// Student redeems a voucher
router.post("/redeem-voucher", authenticateStudent, redeemVoucher);

module.exports = router;
