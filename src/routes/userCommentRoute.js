const express = require("express");

const router = express.Router();
const {
  addComment,
  deleteComment,
  getComment,
} = require("../controllers/userCommentController");

router.get("/comment/getcomment", getComment);
router.post("/comment/create", addComment);
router.post("/comment/delete", deleteComment);

module.exports = router;
