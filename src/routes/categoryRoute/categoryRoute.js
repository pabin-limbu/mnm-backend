const express = require("express");
const { requireSignin, isAdmin } = require("../../common-middleware/index");
const {
  validateCategory,
  isCategoryValidated,
} = require("../../validators/categoryValidator");
const router = express.Router();
const {
  addCategory,
  getCategories,
} = require("../../controllers/categoryController/categoryController");
router.post(
  "/category/create",
  requireSignin,
  isAdmin,
  validateCategory,
  isCategoryValidated,
  addCategory
);
router.get("/category/getcategory", getCategories);

module.exports = router;
