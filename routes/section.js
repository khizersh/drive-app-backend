const express = require("express");
const Section = require("../models/SectionSchema");
const { SUCCESS_CODE, ERROR_CODE } = require("../service/constants");
const router = express.Router();

router.get("/get-section", async (req, res) => {

  try {
    const section = await Section.find({}).populate('products');

    res.send({ status: SUCCESS_CODE, message: "success", data: section }).status(200);
  } catch (error) {
    console.log("error : ", error);
    res.send({ status: ERROR_CODE, message: "Something went wrong!" }).status(200);
  }
});

router.post("/add-section", async (req, res) => {
  const request = new Section(req.body);

  try {
    const section = await request.save();

    res.send({ status: SUCCESS_CODE, message: "success", data: section }).status(200);
  } catch (error) {
    console.log("error : ", error);
    res.send({ status: ERROR_CODE, message: "Something went wrong!" }).status(200);
  }
});


module.exports = router;