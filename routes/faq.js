const express = require("express");
const FAQ = require("../models/FaqSchema");
const { SUCCESS_CODE, ERROR_CODE } = require("../service/constants");
const router = express.Router();

router.post("/add-faq", async (req, res) => {
  const request = new FAQ(req.body);
  try {
    if (request) {
      const faq = await request.save();
      res
        .send({ status: SUCCESS_CODE, message: "success!", data: faq })
        .status(200);
    } else {
      res.send({ status: ERROR_CODE, message: "Invalid call!" }).status(200);
    }
  } catch (error) {
    res
      .send({ status: ERROR_CODE, message: "Something went wrong!" })
      .status(200);
  }
});

router.get("/get-faq", async (req, res) => {
  try {
    const data = await FAQ.find({});
    res
      .send({ status: SUCCESS_CODE, message: "success!", data: data })
      .status(200);
  } catch (error) {
    res
      .send({ status: ERROR_CODE, message: "Something went wrong!" })
      .status(200);
  }
});

module.exports = router;
