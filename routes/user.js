const express = require("express");
const {
  addToCart,
  removeFromCart,
  addToFavorite,
  removeFromFavorite,
  addOrder,
  removeOreder,
  orderUpDate,
  getInfo,
  getOrderbyId,
  getAllOrdes,
  spacail,
  tt,
} = require("../controllers/usersController");
const verifyJWT = require("../middleware/virefyToken");
const router = express.Router();
// router.use(verifyJWT);

router.route("/:id").get(getInfo);
router.route("/order/:orderId").get(getOrderbyId);
router.route("/orders/all").get(getAllOrdes);
router.route("/addToCart").post(addToCart);
router.route("/removeFromCart").post(removeFromCart);
router.route("/addTofavorite").post(addToFavorite);
router.route("/removeFromFavorite").post(removeFromFavorite);
router.route("/order").post(addOrder);
router.route("/orderUpDate").post(orderUpDate);
router.route("/removeOrder").post(removeOreder);
router.route("/spOrder").post(spacail);

module.exports = router;
