const moment = require("moment");
const mongoose = require("mongoose");

const ReviewSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
  },
  productSlug: {
    type: String,
    required: true,
  },
  date: {
    type: String,
    default: moment(new Date()).format().split("+")[0],
    // default: moment(new Date()).format().split("+")[0].split("T").join(" | "),
    required: false,
  },
  review: {
    type: String,
    required: true,
  },
  reviewCount: {
    type: Number,
    required: true,
  },
});

const Category = mongoose.model("reviews", ReviewSchema);

module.exports = Category;
