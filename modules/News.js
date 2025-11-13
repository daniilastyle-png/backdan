const mongoose = require("mongoose");

const newsSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      require: true,
      unique: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("News", newsSchema);
