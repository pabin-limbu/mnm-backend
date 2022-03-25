const usercomment = require("../models/usercomment");
const UserComment = require("../models/usercomment");

//add comment
exports.addComment = async (req, res) => {
  try {
    const userComment = new UserComment({
      commenter: req.body.commenter,
      comment: req.body.comment,
    });

    userComment.save((err, data) => {
      if (err) {
        return res.status(401).json({ err });
      }
      if (data) {
        return res.status(200).json({ data });
      }
    });
  } catch (error) {
    console.log(err);
  }
};

//get comment
exports.getComment = async (req, res) => {
  UserComment.find({}).exec((err, data) => {
    if (err) {
      return res.status(400).json({ err });
    }
    if (data) {
      return res.status(200).json({ data });
    }
  });
};

exports.deleteComment = async (req, res) => {
  UserComment.findByIdAndRemove(req.body.id, (err, data) => {
    if (data) {
      return res.status(200).json({ data });
    }
    if (data === null) {
      return res.status(200).json({ message: "no data available" });
    }
    if (err) {
      console.log(err);
    }
  }).exec();
};
//delete comment
