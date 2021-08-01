const express = require("express");
const multer = require("multer"); //npm package to work with file upload.
const { requireSignin, isAdmin } = require("../common-middleware/index");
const shortid = require("shortid");
const path = require("path");
const {
  validateCategory,
  isCategoryValidated,
} = require("../validators/categoryValidator");

const router = express.Router();
const {
  addCategory,
  getCategories,
  getCategoriesLinearList,
  updateCategories,
  deleteCategories,
} = require("../controllers/categoryController");

//multer configuration to set the destination of file and custom file name.
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(path.dirname(__dirname), "uploads")); // __dirname--> current directory,dirname.(__dirname)--> current directorys parent directory
  },
  filename: function (req, file, cb) {
    //cb(null, file.fieldname + '-' + Date.now())
    cb(null, shortid.generate() + "-" + file.originalname);
  },
});

const upload = multer({ storage });

router.post(
  "/category/create",
  requireSignin,
  isAdmin,
  upload.single("categoryImage"),
  validateCategory,
  isCategoryValidated,
  addCategory
);
router.get("/category/getcategory", getCategories);
router.get("/category/getcategoryList", getCategoriesLinearList);
router.post(
  "/category/updateCategory",
  upload.single("categoryImage"),
  updateCategories
);
router.post("/category/delete", deleteCategories);
module.exports = router;
