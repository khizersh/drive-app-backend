const mongoose = require("mongoose");

const CategorySchema = new mongoose.Schema({
  categoryTitle: {
    type: String,
    required: true,
  },
  categoryImage: {
    type: String,
    required: false,
  },
  categorySlug: {
    type: String,
    required: false,
  },
  active: {
    type: Boolean,
    required: false,
  },
  products: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "products",
    },
  ],
});

const Category = mongoose.model("category", CategorySchema);

module.exports = Category;
