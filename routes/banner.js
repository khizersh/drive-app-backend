const express = require("express");
const Banner = require("../models/BannerSchema");
const { SUCCESS_CODE, ERROR_CODE } = require("../service/constants");
const router = express.Router();

router.get("/get-banner", async (req, res) => {
  //   // let path = "../backend/csv/user.csv";

  try {
    const banner = await Banner.find({});

    res
      .send({ status: SUCCESS_CODE, message: "success", data: banner })
      .status(200);
  } catch (error) {
    console.log("error : ", error);
    res
      .send({ status: ERROR_CODE, message: "Something went wrong!" })
      .status(200);
  }
});

router.post("/add-banner", async (req, res) => {
  const request = new Banner(req.body);
  //   // let path = "../backend/csv/user.csv";

  try {
    const banner = await request.save();

    res
      .send({ status: SUCCESS_CODE, message: "success", data: banner })
      .status(200);
  } catch (error) {
    console.log("error : ", error);
    res
      .send({ status: ERROR_CODE, message: "Something went wrong!" })
      .status(200);
  }
});
router.delete("/delete-banner/:id", async (req, res) => {
  //   // let path = "../backend/csv/user.csv";

  try {
    if (req.params.id) {
      await Banner.deleteOne({ _id: req.params.id });
      res.send({ status: SUCCESS_CODE, message: "success" }).status(200);
    } else {
      res.send({ status: ERROR_CODE, message: "Invalid cal!" }).status(200);
    }
  } catch (error) {
    console.log("error : ", error);
    res
      .send({ status: ERROR_CODE, message: "Something went wrong!" })
      .status(200);
  }
});

module.exports = router;
