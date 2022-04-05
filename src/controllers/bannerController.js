const Banner = require("../models/banner");
const fs = require("fs");
const path = require("path");

exports.addBanner = async (req, res) => {
  try {
    const { name, linkType, slug, category, slugId } = req.body;
    const bannerImage = req.file.filename;

    const banner = new Banner({
      name: name,
      slug: slug,
      linkType: linkType,
      bannerImage: bannerImage,
      slugId: slugId,
      category: category,
      createdBy: req.user._id,
    });

    banner.save((error, banner) => {
      if (error) {
        return res.status(400).json({ error });
      }
      if (banner) {
        return res.status(200).json({ banner });
      }
    });
  } catch (error) {
    res.status(400).json({ error });
  }
};

exports.getBanner = async (req, res) => {
  try {
    Banner.find({})
      .populate({ path: "category", select: "_id slug" })
      .exec((error, data) => {
        if (data) {
          return res.status(200).json({ data });
        }
        if (error) {
          return res.status(401).json({ error });
        }
      });
  } catch (error) {
    return res.status(400).json({ error });
  }
};

exports.deleteBanner = async (req, res) => {
  // console.log(req.body);
  //delete banner image from Upload directory.
  if (
    fs.existsSync(
      path.join(path.dirname(__dirname), "uploads/") + req.body.bannerImage
    )
  ) {
    fs.unlink(
      path.join(path.dirname(__dirname), "uploads/") + req.body.bannerImage,
      (err) => {
        if (err) {
          // return res.status(400).json({ err });
          console.log(err);
        }
      }
    );
  }
  //delete banner data from database
  Banner.findByIdAndRemove(req.body._id, (err, data) => {
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
