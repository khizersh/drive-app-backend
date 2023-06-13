const mongoose = require("mongoose");

const CollectionSchema = new mongoose.Schema({
  email: {
    type: String,
    require: true,
  },
  group: {
    type: Array,
    require: true,
  },
  resourceId: {
    type: String,
    require: true,
  },
  resource: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "folder",
  },
});

const Collection = mongoose.model("collection", CollectionSchema);

module.exports = Collection;
