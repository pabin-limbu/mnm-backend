const express = require("express");
const { requireSignin, isUser } = require("../../common-middleware/index");
const router = express.Router();
const {
  addItemToCart,
} = require("../../controllers/cartController.js/cartController");
router.post("/user/cart/addtocart", requireSignin, isUser, addItemToCart);
//router.get("/category/getcategory", getCategories);

module.exports = router;
