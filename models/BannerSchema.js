const mongoose = require("mongoose");

const BannerSchema = new mongoose.Schema({
  heroImageWeb: {
    type: String,
    required: true,
  },
  heroImageMobile: {
    type: String,
    require: false,
  },
  backgroundImageWeb: {
    type: String,
    require: false,
  },
  backgroundImageMobile: {
    type: String,
    require: false,
  },
  backgroundColor: {
    type: String,
    require: false,
  },
  subTitle: {
    type: String,
    require: false,
  },
  title: {
    type: String,
    require: false,
  },
  offerName: {
    type: String,
    require: false,
  },
  productId: {
    type: String,
    require: true,
  },
  logoList: {
    type: Array,
    require: false,
  },
  redirectLink: {
    type: String,
    require: false,
  },
});

const Banner = mongoose.model("banner", BannerSchema);

module.exports = Banner;

