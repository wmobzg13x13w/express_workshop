const mongoose = require("mongoose");

const voucherSchema = new mongoose.Schema({
  code: {
    type: String,
    unique: true,
    required: true,
  },
  isRedeemed: {
    type: Boolean,
    default: false,
  },
});

const Voucher = mongoose.model("Voucher", voucherSchema);

module.exports = Voucher;
