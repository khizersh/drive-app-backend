const mongoose = require("mongoose");

const SectionSchema = new mongoose.Schema({
  title: {
    type: String,
    require: true,
  },
  isCategory: {
    type: Boolean,
    require: true,
  },
  // productList: {
  //   type: Array,
  //   require: true,
  // },
  products: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "products",
    },
  ],
});

const Section = mongoose.model("section", SectionSchema);

module.exports = Section;
