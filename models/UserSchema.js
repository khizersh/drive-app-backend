const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    require: true,
  },
  email: {
    type: String,
    require: true,
  },
  password: {
    type: String,
    require: true,
  },
  company: {
    type: String,
    require: true,
  },
  jobTitle: {
    type: String,
    require: true,
  },
  contact: {
    type: String,
    require: true,
  },
  linkedIn: {
    type: String,
    require: false,
  },
  skypeName: {
    type: String,
    require: false,
  },
  address1: {
    type: String,
    require: false,
  },
  address2: {
    type: String,
    require: false,
  },
  city: {
    type: String,
    require: false,
  },
  state: {
    type: String,
    require: false,
  },
  postCode: {
    type: String,
    require: false,
  },
  country: {
    type: String,
    require: false,
  },
  summary: {
    type: String,
    require: false,
  },
  contactName: {
    type: String,
    require: false,
  },
  purpose: {
    type: String,
    require: false,
  },
  skills: {
    type: String,
    require: false,
  },
  verified: {
    type: Boolean,
    require: false,
    default: false,
  },
  adminVerified: {
    type: Boolean,
    require: false,
    default: false,
  },
  role: {
    type: String,
    require: false,
    default: "user",
  },
  permissions: {
    type: Array,
    require: false,
  },
});

const User = mongoose.model("users", UserSchema);

module.exports = User;
