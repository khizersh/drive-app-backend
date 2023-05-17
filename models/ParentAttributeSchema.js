const mongoose = require("mongoose");

const ParentAttributeSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  isActive: {
    type: Boolean,
    required: true,
  },
 
});

const ParentAttribute = mongoose.model("parentAttribute", ParentAttributeSchema);

module.exports = ParentAttribute;
