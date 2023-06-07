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
  description: {
    type: String,
    required: false,
  },
  rootFolder: {
    type: Boolean,
    require: true,
  },
  homeParentId: {
    type: String,
    require: false,
  },
  isFolder: {
    type: Boolean,
    require: true,
  },
  file: {
    type: String,
    require: false,
  },
  folderImage: {
    type: String,
    require: true,
  },
  children: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "folder",
    },
  ],
  parentId: {
    type: String,
    require: true,
  },
  resourcesCount: {
    type: Number,
    require: true,
  },
  folderCount: {
    type: Number,
    require: true,
  },
  addedBy: {
    type: String,
    require: true,
  },
  createdDate: {
    type: String,
    require: false,
  },
  mimeType: {
    type: String,
    require: false,
  },
  lastUpdatedBy: {
    type: String,
    require: true,
  },
  folderPath: {
    type: Array,
    require: false,
  },
  fileFormat: {
    type: String,
    require: false,
  },
  fileSize: {
    type: String,
    require: false,
  },
  width: {
    type: String,
    require: false,
  },
  height: {
    type: String,
    require: false,
  },
});

const User = mongoose.model("folder", FolderSchema);

module.exports = User;
