require("dotenv/config");
const express = require("express");
const router = express.Router();
const User = require("../models/UserSchema");
const OTP = require("../models/OtpSchema");
const Folder = require("../models/FolderSchema");
const { validateEmail, generateOtp } = require("../service/commonService");
const { sendEmail } = require("../service/emailService");
const { createCanvas, loadImage, Image } = require('canvas');
const psd = require('psd');
const axios = require('axios');
const {
  USER_REGISTER_OTP_SUBJECT,
  SUCCESS_CODE,
  ERROR_CODE,
} = require("../service/constants");
const fs = require("fs");
const path = require("path");
const moment = require("moment/moment");

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

const upload = multer({ storage }).single("file");


router.post("/upload", upload, async (req, res) => {
  const reqBody = JSON.parse(req.body.data);
  const body = new Folder(reqBody);
  try {
    if (body.userId) {
      const user = await User.findById({ _id: body.userId });
      if (user != null) {
        if (!body.isFolder) {
          // UPLOADING IMAGE IF FILE PRESENT
          let myFile = req.file.originalname.split(".");
          const fileType = myFile[myFile.length - 1];
          const params = {
            Bucket: process.env.S3_BUCKET,
            Key: `${uuidv4()}.${fileType}`,
            Body: req.file.buffer,
          };
          s3.upload(params, async (error, data) => {
            if (error) {
              return res
                .send({ status: ERROR_CODE, message: "Something went wrong!" })
                .status(200);
            }
            body.mimeType = req.file.mimetype;
            body.fileType = fileType;
            body.file = data.Location;
            const date =
              user.firstName +
              ", " +
              moment(new Date()).format().split("+")[0].split("T").join(" | ");
            let create = moment(new Date())
              .format()
              .split("+")[0]
              .split("T")[0];
            body.createdDate = create;
            body.addedBy = date;
            body.fileSize = body.fileSize
            body.lastUpdatedBy = date;
            if (body.parentId) {
              const parentFolder = await Folder.findById({
                _id: body.parentId,
              });
              body.folderPath = [];
              if (parentFolder.folderPath.length) {
                parentFolder.folderPath.map((m) => {
                  body.folderPath.push(m);
                });
              }
              const fold = await body.save();
              fold.folderPath.push({ name: body.name, id: fold._id });
              await fold.save();
              if (parentFolder?.children?.length) {
                parentFolder.children.push(fold._id);
              } else {
                parentFolder.children = [];
                parentFolder.children.push(fold._id);
              }
              if (body.isFolder) {
                parentFolder.folderCount = parentFolder.folderCount
                  ? parentFolder.folderCount + 1
                  : 1;
              } else {
                parentFolder.resourcesCount = parentFolder.resourcesCount
                  ? parentFolder.resourcesCount + 1
                  : 1;
              }
              parentFolder.save();
            } else {
              body.folderPath = [];
              const data = await body.save();
              data.folderPath.push({ name: body.name, id: data._id });
              await data.save();
            }
            res
              .send({
                status: SUCCESS_CODE,
                message: "Resource created successfully!",
              })
              .status(200);
          });
        } else {
          // UPLOADING FOLDER
          const date =
            user.firstName +
            ", " +
            moment(new Date()).format().split("+")[0].split("T").join(" | ");
          body.addedBy = date;
          body.lastUpdatedBy = date;
          if (body.parentId) {
            const parentFolder = await Folder.findById({ _id: body.parentId });
            body.folderPath = [];
            if (parentFolder.folderPath.length) {
              parentFolder.folderPath.map((m) => {
                body.folderPath.push(m);
              });
            }
            const fold = await body.save();
            fold.folderPath.push({ name: body.name, id: fold._id });
            await fold.save();
            if (parentFolder?.children?.length) {
              parentFolder.children.push(fold._id);
            } else {
              parentFolder.children = [];
              parentFolder.children.push(fold._id);
            }
            if (body.isFolder) {
              parentFolder.folderCount = parentFolder.folderCount
                ? parentFolder.folderCount + 1
                : 1;
            } else {
              parentFolder.resourcesCount = parentFolder.resourcesCount
                ? parentFolder.resourcesCount + 1
                : 1;
            }
            parentFolder.save();
          } else {
            body.folderPath = [];
            const data = await body.save();
            data.folderPath.push({ name: body.name, id: data._id });
            await data.save();
          }
          res
            .send({
              status: SUCCESS_CODE,
              message: "Resource created successfully!",
            })
            .status(200);
        }
      } else {
        res.send({ status: ERROR_CODE, message: "Invalid Call!" }).status(200);
      }
    } else {
      res.send({ status: ERROR_CODE, message: "Invalid Call!" }).status(200);
    }
  } catch (error) {
    console.log("error : ", error);
    res
      .send({ status: ERROR_CODE, message: "Something went wrong!" })
      .status(200);
  }
});

router.post("/getResourceByUser", async (req, res) => {
  const body = req.body;

  try {
    if (body.email) {
      const user = await User.findOne({ email: body.email });
      if (user) {
        const folders = await Folder.find({
          userId: user._id,
          isFolder: true,
          // rootFolder: true,
        });
        // }).populate("children");
        res
          .send({ status: SUCCESS_CODE, message: "success", data: folders })
          .status(200);
      } else {
        res.send({ status: ERROR_CODE, message: "Invalid call!" }).status(200);
      }
    }
  } catch (error) {
    res
      .send({ status: ERROR_CODE, message: "Something went wrong!" })
      .status(200);
  }
});

router.post("/getResourcesByRootParent", async (req, res) => {
  const body = req.body;

  try {
    if (body.homeParentId && body.email) {
      const user = await User.findOne({ email: body.email });
      if (user) {
        var folders = [];
        if (body.isFolder === true) {
          folders = await Folder.find({
            homeParentId: body.homeParentId,
            isFolder: body.isFolder,
            userId: user._id,
          }).populate("children");
        } else {
          folders = await Folder.find({
            homeParentId: body.homeParentId,
            userId: user._id,
            parentId: "",
          }).populate("children");
        }
        res
          .send({ status: SUCCESS_CODE, message: "success", data: folders })
          .status(200);
      } else {
        res.send({ status: ERROR_CODE, message: "Invalid call!" }).status(200);
      }
    } else {
      res.send({ status: ERROR_CODE, message: "Invalid call!" }).status(200);
    }
  } catch (error) {
    console.log("error : ", error);
    res
      .send({ status: ERROR_CODE, message: "Something went wrong!" })
      .status(200);
  }
});
router.post("/saveDate", async (req, res) => {
  const body = req.body;

  try {
    const folder = await Folder.find();
    folder.map((m , index) => {
      let create = moment(new Date()).format().split("+")[0].split("T")[0];
      m.createdDate = create;
      if(index < 4){
        m.mimeType = "image/png"
      }else{
        m.mimeType = "video/mp4"
      }
      m.save();
    });

    res.send({ status: SUCCESS_CODE, message: "Save!" }).status(200);
  } catch (error) {
    console.log("error : ", error);
    res
      .send({ status: ERROR_CODE, message: "Something went wrong!" })
      .status(200);
  }
});

router.post("/getResourceByFolder", async (req, res) => {
  const body = req.body;

  try {
    if (body.parentId) {
      const folders = await Folder.find({
        parentId: body.parentId,
        // }).populate("children");
      });
      res
        .send({ status: SUCCESS_CODE, message: "success", data: folders })
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
router.post("/getResourceById", async (req, res) => {
  const body = req.body;

  try {
    if (body.id) {
      const folder = await Folder.findById({
        _id: body.id,
      });
      res
        .send({ status: SUCCESS_CODE, message: "success", data: folder })
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
router.post("/getResourceByFolder", async (req, res) => {
  const body = req.body;

  try {
    if (body.parentId) {
      const folders = await Folder.find({
        parentId: body.parentId,
        // }).populate("children");
      });
      res
        .send({ status: SUCCESS_CODE, message: "success", data: folders })
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

router.post("/getResourceByKeyword", async (req, res) => {
  const body = req.body;

  try {
    if (body.homeParentId && body.keyword && body.email) {
      const user = await User.findOne({ email: body.email });
      if (user) {
        const folders = await Folder.find({
          homeParentId: body.homeParentId,
        });
        const filtered = folders.filter((m) =>
          m.name.toLowerCase().includes(body.keyword.toLowerCase())
        );
        res
          .send({ status: SUCCESS_CODE, message: "success", data: filtered })
          .status(200);
      } else {
        res.send({ status: ERROR_CODE, message: "Invalid call!" }).status(200);
      }
    } else {
      res.send({ status: ERROR_CODE, message: "Invalid call!" }).status(200);
    }
  } catch (error) {
    res
      .send({ status: ERROR_CODE, message: "Something went wrong!" })
      .status(200);
  }
});

router.post("/getAllFile", async (req, res) => {
  const otp = new OTP(req.body);

  try {
    if (otp.email && otp.otp) {
      const otpDb = await OTP.findOne({ otp: otp.otp, isExpired: false });
      if (otpDb != null) {
        const user = await User.findOne({ email: otp.email });
        if (user != null) {
          otpDb.isExpired = true;
          user.verified = true;
          user.save();
          await otpDb.save();
          res.send({ status: SUCCESS_CODE, message: "success" }).status(200);
        } else {
          res.send({ status: ERROR_CODE, message: "Invalid Otp!" }).status(200);
        }
      } else {
        res.send({ status: ERROR_CODE, message: "Invalid Otp!" }).status(200);
      }
    }
  } catch (error) {
    res
      .send({ status: ERROR_CODE, message: "Something went wrong!" })
      .status(200);
  }
});



// Server-side route handling the download request
router.post('/downloadImage', async (req, res) => {
  try {
    // Get the requested format from the query parameters
    const { format , url } = req.body;

    // Fetch the image data from a provided URL
    const imageUrl = url;
    const response = await axios.get(imageUrl, { responseType: 'arraybuffer' });
    // // const response = await axios.get(imageUrl, { responseType: 'arraybuffer' });
    // const response = await fs.promises.readFile(path.join(imageUrl));
    const imageData = response.data;

    let fileBuffer;
    let contentType;

    // Convert and generate the image file based on the requested format
    if (format === 'png') {
      // Convert the image to PNG format using the 'canvas' package
      const img = new Image();
      img.src = Buffer.from(imageData);
      const canvas = createCanvas(img.width, img.height);
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0);
      fileBuffer = canvas.toBuffer();
      contentType = 'image/png';
    } else if (format === 'jpeg') {
      // Convert the image to JPEG format using the 'canvas' package
      const img = new Image();
      img.src = Buffer.from(imageData);
      const canvas = createCanvas(img.width, img.height);
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0);
      fileBuffer = canvas.toBuffer('image/jpeg');
      contentType = 'image/jpeg';
    }
    else if (format === 'svg') {
      // Convert the image to JPEG format using the 'canvas' package
      const img = new Image();
      img.src = Buffer.from(imageData);
      const canvas = createCanvas(img.width, img.height , "svg");
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0);
      fileBuffer = canvas.toBuffer('image/svg');
      contentType = 'image/webp';
    }  else if (format === 'psd') {
      // Generate the PSD file using the 'psd' package
      const psdFile = psd.fromDIB(imageData);

      fileBuffer = psdFile.toBuffer();
      contentType = 'image/vnd.adobe.photoshop';
    } else {
      return res.status(400).send('Invalid format');
    }

    res.setHeader('Content-Disposition', `attachment; filename="image.${format}"`);
    res.setHeader('Accept-Ranges', `bytes`);
    res.setHeader('Content-Type', contentType);
    var base64data = new Buffer(fileBuffer).toString('base64');
    res.send(base64data);
  } catch (error) {
    console.error('Error generating image file:', error);
    res.status(500).send('Error generating image file');
  }
});

module.exports = router;
