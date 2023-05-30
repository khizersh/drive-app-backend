const express = require("express");
const router = express.Router();
const User = require("../models/UserSchema");
const OTP = require("../models/OtpSchema");
const Folder = require("../models/FolderSchema");
const { validateEmail, generateOtp } = require("../service/commonService");
const { sendEmail } = require("../service/emailService");
const {
  USER_REGISTER_OTP_SUBJECT,
  SUCCESS_CODE,
  ERROR_CODE,
} = require("../service/constants");
const fs = require("fs");
const path = require("path");
const moment = require("moment/moment");

router.post("/upload", async (req, res) => {
  const body = new Folder(req.body);

  try {
    if (body.userId) {
      const user = await User.findById({ _id: body.userId });
      if (user != null) {
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
        const folders = await Folder.find({
          homeParentId: body.homeParentId,
          userId: user._id,
        }).populate("children");
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
      }).populate("children");
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

module.exports = router;
