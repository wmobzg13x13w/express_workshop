const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");

const userSchema = mongoose.Schema({
  fullName: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  role: { type: String, enum: ["Student", "Professor"], required: true },
});

userSchema.methods.generateTokens = function () {
  return jwt.sign({ _id: this._id, role: this.role }, process.env.ACCES_TOKEN, {
    expiresIn: process.env.JWT_EXP,
  });
};

module.exports = mongoose.model("User", userSchema);
