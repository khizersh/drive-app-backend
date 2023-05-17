const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    require: true,
  },
  password: {
    type: String,
    require: true,
  },
  country: {
    type: String,
    require: true,
  },
  contact: {
    type: String,
    require: true,
  },
  address: {
    type: String,
    require: true,
  },
  verified: {
    type: Boolean,
    require: false,
    default: false,
  },
});

const User = mongoose.model("users", UserSchema);

module.exports = User;
