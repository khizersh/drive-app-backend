const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema({
  productTitle: {
    type: String,
    required: true,
  },
  productDesc: {
    type: String,
    require: false,
  },
  brand: {
    type: String,
    require: false,
  },
  rating: {
    type: String,
    require: false,
    default : 5
  },
  slug: {
    type: String,
    require: false,
  },
  categorySlug: {
    type: String,
    require: false,
  },
  categoryTitle: {
    type: String,
    require: false,
  },
  deliveryTime: {
    type: String,
    require: false,
  },
  price: {
    type: String,
    require: true,
  },
  inDiscount: {
    type: Boolean,
    require: false,
  },
  percentageOff: {
    type: String,
    require: false,
  },
  discountedPrice: {
    type: String,
    require: false,
  },
  hasStock: {
    type: Boolean,
    require: true,
  },
  isActive: {
    type: Boolean,
    require: true,
  },
  images: {
    type: Array,
    require: true,
  },
  attribute: {
    type: Array,
    require: false,
  },
});

const Product = mongoose.model("products", ProductSchema);

module.exports = Product;
