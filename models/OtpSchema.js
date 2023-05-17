const mongoose = require("mongoose");

const OtpSchema = new mongoose.Schema({
  email: {
    type: String,
    require: true,
  },
  otp: {
    type: String,
    require: false,
  },
  isExpired: {
    type: Boolean,
    require: false,
  },
});

const Section = mongoose.model("otp", OtpSchema);

module.exports = Section;
