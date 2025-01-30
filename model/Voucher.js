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
  associatedEmail: {
    type: String,
    required: true,
  },

  expiresAt: {
    type: Date,
  },
});

module.exports = mongoose.model("Voucher", voucherSchema);
