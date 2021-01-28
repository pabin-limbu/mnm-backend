const Product = require("../../models/product");

const slugify = require("slugify");

exports.createProduct = (req, res) => {
  const { name, price, description, category, quantity } = req.body;
  //picture should be in array as it ca be multiple file.
  let productPictures = [];
  if (req.files.length > 0) {
    productPictures = req.files.map((file) => {
      return { img: file.filename };
    });
  }

  const product = new Product({
    name: name,
    slug: slugify(name),
    price: price,
    quantity: quantity,
    description: description,
    productPictures: productPictures,
    category: category,
    createdBy: req.user._id,
  });

  //save product
  product.save((error, product) => {
    if (error) {
      return res.status(400).json({ error });
    }
    if (product) {
      res.status(200).json({ product });
    }
  });
};
