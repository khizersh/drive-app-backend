const express = require("express");
const Review = require("../models/ReviewScehma");
const Product = require("../models/ProductSchema");
const User = require("../models/UserSchema");
const { SUCCESS_CODE, ERROR_CODE } = require("../service/constants");
const router = express.Router();

router.post("/get-rating-by-product", async (req, res) => {
  //   // let path = "../backend/csv/user.csv";
  let body = req.body;

  try {
    if (body.productSlug) {
      const reviews = await Review.find({ productSlug: body.productSlug });
      res.send({ status: SUCCESS_CODE, message: "success", data: reviews }).status(200);
    } else {
      res.send({ status: ERROR_CODE, message: "Invalid call!" }).status(200);
    }
  } catch (error) {
    console.log("error : ", error);
    res.send({ status: ERROR_CODE, message: "Something went wrong!" }).status(200);
  }
});

router.post("/add-rating", async (req, res) => {
  const request = new Review(req.body);
  try {
    if (request.productSlug) {
      const isValidProduct = await Product.exists({
        slug: request.productSlug,
      });
      const isValidUser = await User.findById({
        _id: request.userId,
      });
      if (isValidProduct && isValidUser) {
        if (isValidUser.verified) {
          const review = await request.save();
          res
            .send({ status: SUCCESS_CODE, message: "success", data: review })
            .status(200);
        } else {
          res
            .send({
              status: ERROR_CODE,
              message: "Please verify your email to add a review!",
            })
            .status(200);
        }
      } else {
        res.send({ status: ERROR_CODE, message: "Invalid call!" }).status(200);
      }
    } else {
      res.send({ status: ERROR_CODE, message: "Invalid call!" }).status(200);
    }
  } catch (error) {
    console.log("error : ", error);
    res.send({ status: ERROR_CODE, message: "Something went wrong!" }).status(200);
  }
});

module.exports = router;
