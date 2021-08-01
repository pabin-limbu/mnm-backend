const Product = require("../models/product");
const category = require("../models/category");

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

exports.getProductsBySlug = (req, res) => {
  const { slug } = req.params;
  category
    .findOne({ slug: slug })
    .select("_id")
    .exec((error, category) => {
      if (error) {
        return res.status(400).json({ error });
      }
      if (category) {
        Product.find({ category: category._id }).exec((error, products) => {
          if (error) {
            res.status(400).json({ error });
          }
          if (products.length > 0) {
            res.status(200).json({
              products,
              productsByPrice: {
                under5k: products.filter((product) => product.price <= 5000),
                under10k: products.filter(
                  (product) => product.price > 5000 && product.price <= 10000
                ),
                under15k: products.filter(
                  (product) => product.price > 10000 && product.price <= 15000
                ),
                under20k: products.filter(
                  (product) => product.price > 15000 && product.price <= 20000
                ),
                under30k: products.filter(
                  (product) => product.price > 20000 && product.price <= 30000
                ),
              },
            });
          }
        });
      } else {
        res.status(200).json({ message: "product not available" });
      }
    });
};

exports.updateProduct = async (req, res) => {
  const { _id, name, price, description, category, quantity, isfeatured } =
    req.body;
  const newProduct = {
    name,
    price,
    description,
    category,
    quantity,
    isfeatured,
  };

  //update product based on the id.
  const updateProduct = await Product.findOneAndUpdate(
    { _id: _id },
    newProduct,
    { new: true }
  );

  res.status(200).json({ updateProduct });
};
