const mongoose = require("mongoose");

const heroSchema = new mongoose.Schema({
  images: {
    type: Array,
    required: true,
  },
});

module.exports = mongoose.model("Hero", heroSchema);
