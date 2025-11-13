const express = require("express");
const {
  newHero,
  getHero,
  updateHero,
} = require("../controllers/heroController");
const router = express.Router();

router.route("/").get(getHero).patch(updateHero).post(newHero);

module.exports = router;
