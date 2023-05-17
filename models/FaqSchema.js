const mongoose = require("mongoose");

const FaqSchema = new mongoose.Schema({
  question: {
    type: String,
    required: true,
  },
  answer: {
    type: String,
    require: true,
  },
  active: {
    type: Boolean,
    require: true,
  },
});

const FAQ = mongoose.model("faq", FaqSchema);

module.exports = FAQ;
