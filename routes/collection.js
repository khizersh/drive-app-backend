const express = require("express");
const router = express.Router();
const User = require("../models/UserSchema");
const Sidebar = require("../models/SidebarSchema");
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
const Collection = require("../models/CollectionShema");
const CollectionGroup = require("../models/CollectionGroupSchema");

router.post("/getAll", async (req, res) => {
  const body = new Collection(req.body);

  try {
    if (body.email) {
      var response = null;
      var tags = {};
      const resp = await Collection.find({ email: body.email }).populate(
        "resource"
      );
      resp.map((collect) => {
        collect.group.map((tag) => {
          if (!tags[tag]) {
            tags[tag] = [];
          }
        });
      });
      resp.map((collect) => {
        collect.group.map((tag) => {
          if (!tags[tag].find((t) => t.resourceId == collect.resourceId)) {
            tags[tag].push(collect);
          }
        });
      });

      res
        .send({ status: SUCCESS_CODE, message: "success", data: tags })
        .status(200);
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

router.post("/getCollectionById", async (req, res) => {
  const body = new Collection(req.body);

  try {
    if (body.resourceId) {
      const resp = await Collection.findOne({ resource: body.resourceId });
      res
        .send({ status: SUCCESS_CODE, message: "success", data: resp })
        .status(200);
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
router.post("/updateList", async (req, res) => {
  const body = req.body;

  try {
    if (body.email && body.group && body.resourceId) {
      var message = "";

      var finalArray = [];

      body.group.map(async (m) => {
        const group = await CollectionGroup.exists({
          group: m,
          email: body.email,
        });
        if (!group) {
          const group = new CollectionGroup();
          group.email = body.email;
          group.group = m;
          group.save();
        }
      });

      const resp = await Collection.findOne({
        email: body.email,
        resourceId: body.resourceId,
      });

      if (resp) {
        resp.group = body.group;
        resp.save();
      } else {
        const collect = new Collection();
        collect.email = body.email;
        collect.resourceId = body.resourceId;
        collect.group = body.group;
        collect.resource = body.resourceId;
        collect.save();
      }

      // if (resp) {
      //   if (resp?.resourceList?.length) {
      //     const data = resp.resourceList.find((m) => m == body.resourceId);
      //     if (data) {
      //       finalArray = resp.resourceList.filter((m) => m != body.resourceId);
      //       message = "Successfully Removed!";
      //     } else {
      //       finalArray = resp.resourceList;
      //       finalArray.push(body.resourceId);
      //       message = "Successfully Added!";
      //     }
      //     resp.resourceList = finalArray;
      //     resp.group = body.group;
      //     resp.save();
      //   } else {
      //     message = "Successfully Added!";
      //     finalArray.push(body.resourceId);
      //     resp.resourceList = finalArray;
      //     resp.group = body.group;
      //     resp.save();
      //   }
      // } else {
      //   message = "Successfully Added!";
      //   const collect = new Collection();
      //   collect.email = body.email;
      //   finalArray.push(body.resourceId);
      //   collect.resourceList = finalArray;
      //   collect.group = body.group;
      //   collect.save();
      // }
      res.send({ status: SUCCESS_CODE, message: "success" }).status(200);
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

router.post("/getAllCollectionGroup", async (req, res) => {
  const body = req.body;

  try {
    if (body.email) {
      const group = await CollectionGroup.find({ email: body.email });

      res
        .send({ status: SUCCESS_CODE, message: "success", data: group })
        .status(200);
    }
  } catch (error) {
    res
      .send({ status: ERROR_CODE, message: "Something went wrong!" })
      .status(200);
  }
});

router.post("/getAllResourceByUser", async (req, res) => {
  const body = req.body;

  try {
    if (body.email) {
      const user = await User.findOne({ email: body.email });
      if (user) {
        const folders = await Folder.find({
          userId: user._id,
        });
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
