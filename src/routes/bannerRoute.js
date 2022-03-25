const express = require("express");
const fs = require("fs");
const router = express.Router();

const multer = require("multer"); //npm package to work with file upload.
const shortid = require("shortid");
const path = require("path");
const { requireSignin, isAdmin } = require("../common-middleware/index");
const {
  addBanner,
  getBanner,
  deleteBanner,
} = require("../controllers/bannerController");
//multer configuration to set the destination of file and custom file name.
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(path.dirname(__dirname), "uploads")); // __dirname--> current directory,dirname.(__dirname)--> current directorys parent directory
  },
  filename: function (req, file, cb) {
    cb(null, shortid.generate() + "-" + file.originalname);
  },
});
const upload = multer({ storage });

router.get("/banner/getbanner", getBanner);

router.post(
  "/banner/create",
  requireSignin,
  isAdmin,
  upload.single("bannerImage"),
  addBanner
);
router.post("/banner/delete", deleteBanner);
module.exports = router;
