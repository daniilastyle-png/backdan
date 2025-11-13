const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    productTitle: {
      type: String,
      required: true,
    },
    descriptionAr: {
      type: String,
      required: true,
    },
    descriptionFr: {
      type: String,
      required: true,
    },
    descriptionEn: {
      type: String,
      required: true,
    },
    stock: {
      type: String,
      required: true,
    },
    price: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    coverImage: {
      type: String,
      required: true,
    },
    images: {
      type: Array,
      required: true,
    },
    likes: {
      type: Map,
      of: Boolean,
    },
    comments: {
      type: Array,
      default: [],
    },
    family: {
      type: String,
      required: true,
    },
    brand: {
      type: String,
      required: true,
    },
    size: {
      type: String,
      required: true,
    },
    colors: {
      type: Array,
      default: [],
      required: true,
    },
    type: {
      type: String,
      required: true,
    },
    onSale: {
      type: Boolean,
      default: false,
    },

    sale: {
      type: String,
      default: "",
    },
    gender: {
      type: String,
      default: "",
    },
    sold: {
      type: String,
      default: "",
    },
    bought: {
      type: String,
      default: "0",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Product", productSchema);
