const mongoose = require("mongoose");
const userCommentSchema = new mongoose.Schema(
  {
    commenter: { type: String, required: true },
    comment: { type: String, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("usercomment", userCommentSchema);
