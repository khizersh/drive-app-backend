const mongoose = require("mongoose");

const CollectionGroupSchema = new mongoose.Schema({
  email: {
    type: String,
    require: true,
  },
  group: {
    type: String,
    require: true,
  },
});

const CollectionGroup = mongoose.model("collectionGroup", CollectionGroupSchema);

module.exports = CollectionGroup;
