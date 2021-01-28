const express = require("express");
const { requireSignin, isAdmin } = require("../../common-middleware/index");
const router = express.Router();
const {
  createProduct,
} = require("../../controllers/productController/productController");
const multer = require("multer"); //npm package to work with file upload.
const shortid = require("shortid");
const path = require("path");

//multer configuration to set the destination of file and custom file name.
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // cb(null, path.join(path.dirname(__dirname), "uploads")); // __dirname--> current directory,dirname.(__dirname)--> current directorys parent directory
    cb(null, path.join(path.dirname(path.dirname(__dirname)), "uploads")); // __dirname--> current directory,dirname.(__dirname)--> current directorys parent directory
  },
  filename: function (req, file, cb) {
    //cb(null, file.fieldname + '-' + Date.now())
    cb(null, shortid.generate() + "-" + file.originalname);
  },
});

const upload = multer({ storage });

router.post(
  "/product/create",
  requireSignin,
  isAdmin,
  //upload.array("productPicture"),
  upload.array("productPicture"),
  createProduct
);

module.exports = router;
