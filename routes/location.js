const fs = require("fs/promises");
const express = require("express");
const { SUCCESS_CODE, ERROR_CODE } = require("../service/constants");
const router = express.Router();

router.get("/getAllCountries", async (req, res) => {
  try {
    const path = "json/country.json";

    fs.readFile(path)
      .then((fileData) => {
        const json = JSON.parse(fileData);
        res
          .send({ status: SUCCESS_CODE, message: "success", data: json })
          .status(200);
      })
      .catch((error) => {
        console.log("error : ", error);
        res
          .send({ status: ERROR_CODE, message: "Something went wrong!" })
          .status(200);
      });
  } catch (error) {
    console.log("error : ", error);
    res
      .send({ status: ERROR_CODE, message: "Something went wrong!" })
      .status(200);
  }
});


router.post("/getCitiesByCountry", async (req, res) => {
  try {
    const {country} = req.body;
    const path = "json/location.json";

    fs.readFile(path)
      .then((fileData) => {
        const json = JSON.parse(fileData);
        var data = json[country];
        if(!data){
          data = []
        }
        res
          .send({ status: SUCCESS_CODE, message: "success", data: data })
          .status(200);
      })
      .catch((error) => {
        console.log("error : ", error);
        res
          .send({ status: ERROR_CODE, message: "Something went wrong!" })
          .status(200);
      });
  } catch (error) {
    console.log("error : ", error);
    res
      .send({ status: ERROR_CODE, message: "Something went wrong!" })
      .status(200);
  }
});

module.exports = router;
