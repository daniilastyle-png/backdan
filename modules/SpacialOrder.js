const mongoose = require("mongoose");

const SpOrder = new mongoose.Schema({
  pInfo: {
    type: Object,
    default: {},
  },
  UsInfo: {
    type: Object,
    required: true,
  },
  changes: {
    type: String,
    required: true,
  },
  PImages: {
    type: Array,
    default: [],
  },
  cus: {
    type: String,
    default: "",
  },
});

module.exports = mongoose.model("Special", SpOrder);
