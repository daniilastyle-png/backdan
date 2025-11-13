const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      default: "",
    },
    orderId: {
      type: String,
      default: "",
    },
    info: {
      type: Object,
    },
    products: {
      type: Array,
      default: [],
    },
    state: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", orderSchema);
