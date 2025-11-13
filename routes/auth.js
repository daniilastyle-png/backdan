const express = require("express");
const router = express.Router();
const loginLimiter = require("../middleware/loginLimiter");
const {
  login,
  refresh,
  logout,
  regester,
  mod,
} = require("../controllers/authController");

router.route("/").post(loginLimiter, login);
router.route("/regester").post(regester);
router.route("/refresh").get(refresh);
router.route("/modifia/:id").post(mod);
router.route("/logout").post(logout);
module.exports = router;
