const mongoose = require("mongoose");

const FolderSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  label: {
    type: String,
    required: true,
  },
  Icon: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: false,
  },
  rootFolder: {
    type: Boolean,
    require: true,
  },
  items: {
    type: Array,
    require: false,
  },
  parentId: {
    type: Array,
    require: false,
  },
  resourcesCount: {
    type: Number,
    require: true,
  },
  folderCount: {
    type: Number,
    require: true,
  },
});

const User = mongoose.model("sidebar", FolderSchema);

module.exports = User;
