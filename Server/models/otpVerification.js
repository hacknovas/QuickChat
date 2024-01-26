const mongoose = require("mongoose");

const otpSchema = mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  otp: String,
});

const otpModel = mongoose.model("otpverification", otpSchema);

module.exports = otpModel;
