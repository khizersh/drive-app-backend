const express = require("express");
const ParentAttribute = require("../models/ParentAttributeSchema");
const ChildAttribute = require("../models/ChildAttributeSchema");
const { SUCCESS_CODE, ERROR_CODE } = require("../service/constants");
const router = express.Router();

// ===================== Parent Attribute =====================================

router.get("/get-parent-attribute", async (req, res) => {
  //   // let path = "../backend/csv/user.csv";

  try {
    const attributes = await ParentAttribute.find({});
    res
      .send({ status: SUCCESS_CODE, message: "success", data: attributes })
      .status(200);
  } catch (error) {
    console.log("error : ", error);
    res
      .send({ status: ERROR_CODE, message: "Something went wrong!" })
      .status(200);
  }
});

router.post("/add-parent-attribute", async (req, res) => {
  const request = new ParentAttribute(req.body);
  try {
    const attribute = await request.save();
    res
      .send({ status: SUCCESS_CODE, message: "success", data: attribute })
      .status(200);
  } catch (error) {
    console.log("error : ", error);
    res
      .send({ status: ERROR_CODE, message: "Something went wrong!" })
      .status(200);
  }
});
router.put("/edit-parent-attribute", async (req, res) => {
  const request = req.body;
  try {
    if (request.id) {
      const attribute = await ParentAttribute.findOne({ _id: request.id });
      attribute.title = request.title;
      attribute.isActive = request.isActive;
      const data = await attribute.save();
      res
        .send({ status: SUCCESS_CODE, message: "success", data: data })
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

router.delete("/delete-parent-attribute/:id", async (req, res) => {
  try {
    if (req.params.id) {
      const id = req.params.id;
      if (id) {
        const attribute = await ChildAttribute.find({
          parentId: id,
        });
        if (attribute.length) {
          res
            .send({
              status: ERROR_CODE,
              message: "It is associated with other attributes!",
            })
            .status(200);
        } else {
          await ParentAttribute.deleteOne({ _id: id });
          res.send({ status: SUCCESS_CODE, message: "success" }).status(200);
        }
      }
    } else {
      res.send({ status: ERROR_CODE, message: "Invalid call!" }).status(200);
    }
  } catch (error) {
    console.log(error);
    res
      .send({ status: ERROR_CODE, message: "Something went wrong!" })
      .status(200);
  }
});

router.post("/get-child-attribute-by-parent", async (req, res) => {
  // const request = new ChildAttribute(req.body);
  const body = req.body;
  try {
    // const attribute = await request.save();
    const attribute = await ChildAttribute.find({
      parentId: body.parentId,
    });
    res
      .send({ status: SUCCESS_CODE, message: "success", data: attribute })
      .status(200);
  } catch (error) {
    console.log("error : ", error);
    res
      .send({ status: ERROR_CODE, message: "Something went wrong!" })
      .status(200);
  }
});

// ===================== Child Attribute =====================================

router.get("/get-child-attribute", async (req, res) => {
  //   // let path = "../backend/csv/user.csv";

  try {
    const attributes = await ChildAttribute.find({});
    res
      .send({ status: SUCCESS_CODE, message: "success", data: attributes })
      .status(200);
  } catch (error) {
    console.log("error : ", error);
    res
      .send({ status: ERROR_CODE, message: "Something went wrong!" })
      .status(200);
  }
});

router.post("/add-child-attribute", async (req, res) => {
  const request = new ChildAttribute(req.body);
  try {
    if (request.parentId) {
      const attribute = await request.save();
      res
        .send({ status: SUCCESS_CODE, message: "success", data: attribute })
        .status(200);
    } else {
      res
        .send({
          status: ERROR_CODE,
          message: "Select Parent Attribute!",
          data: attribute,
        })
        .status(200);
    }
  } catch (error) {
    console.log("error : ", error);
    res
      .send({ status: ERROR_CODE, message: "Something went wrong!" })
      .status(200);
  }
});

router.post("/edit-child-attribute", async (req, res) => {
  const request = req.body;
  try {
    if (request.id) {
      const childAttribute = await ChildAttribute.findOne({ _id: request.id });
      const parentAttribute = await ParentAttribute.findOne({
        _id: request.parentId,
      });

      if (parentAttribute && parentAttribute) {
        childAttribute.title = request.title;
        childAttribute.isActive = request.isActive;
        const data = await childAttribute.save();
        res
          .send({ status: SUCCESS_CODE, message: "success", data: data })
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

router.delete("/delete-child-attribute/:id", async (req, res) => {
  try {
    if (req.params.id) {
      const id = req.params.id;
      if (id) {
        const attribute = await ChildAttribute.deleteOne({
          _id: id,
        });
        res.send({ status: SUCCESS_CODE, message: "success" }).status(200);
      }
    } else {
      res.send({ status: ERROR_CODE, message: "Invalid call!" }).status(200);
    }
  } catch (error) {
    console.log(error);
    res
      .send({ status: ERROR_CODE, message: "Something went wrong!" })
      .status(200);
  }
});

module.exports = router;
