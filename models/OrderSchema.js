const mongoose = require("mongoose");

const OrderSchema = new mongoose.Schema({
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

const Order = mongoose.model("order", OrderSchema);

module.exports = Order;
