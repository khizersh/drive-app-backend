require("dotenv/config");

const express = require("express");
const router = express.Router();
const multer = require("multer");
const AWS = require("aws-sdk");
const { v4: uuidv4 } = require("uuid");

const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
});

const storage = multer.memoryStorage({
  destination: function (req, file, callback) {
    callback(null, "");
  },
});

const upload = multer({ storage }).single("image");

router.post("/upload", upload, (req, res) => {
  let myFile = req.file.originalname.split(".");
  const fileType = myFile[myFile.length - 1];
//   const data =  JSON.parse(req.body.data);
//   console.log("req.file : ", req.file);

  const params = {
      Bucket: process.env.S3_BUCKET,
      Key: `${uuidv4()}.${fileType}`,
      Body: req.file.buffer
  }

  s3.upload(params, (error, data) => {
      if(error){
          res.status(500).send(error)
      }

      res.status(200).send(data)
  })
//   res.status(200).send({ status: data });
});

module.exports = router;
