const express = require("express");
const {
  createProduct,
  getAllProducts,
  updateProduct,
  getOneProduct,
  deletProduct,
  likePoduct,
  addComents,
  deletComment,
  filtedData,
  getProductByFamily,
  setHero,
  getHero,
} = require("../controllers/productCntrollers");
const verifyJWT = require("../middleware/virefyToken");
const router = express.Router();
// router.use(verifyJWT);
router.route("/").get(getAllProducts);
router.route("/productFamily/:ProdFamily").get(getProductByFamily);

router.route("/create").post(createProduct);
router.route("/hero").post(setHero);
router.route("/getHero").get(getHero);
router.route("/update/:id").patch(updateProduct);
router.route("/delete/:id").delete(deletProduct);
router.route("/:id").get(getOneProduct);
router.route("/like/:id").post(likePoduct);
router.route("/comment/:id").post(addComents);
router.route("/deletComment/:id").post(deletComment);
router.route("/filterd/:ProdFamily/:ProductCat/:ProductSub").get(filtedData);
module.exports = router;
