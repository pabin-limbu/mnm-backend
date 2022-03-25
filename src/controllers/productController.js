const Product = require("../models/product");
const Category = require("../models/category");

const slugify = require("slugify");

const fs = require("fs");
const path = require("path");
const product = require("../models/product");

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

exports.getProductsBySlug = async (req, res) => {
  //v1.depreciated -- delete later.
  //Api fing category with matching slug, if matched get all product having this categoryid.
  // find category id with slug first and then using that id find items.
  // Category.findOne({ slug: slug })
  //   .select("_id")
  //   .exec((error, category) => {
  //     if (error) {
  //       return res.status(400).json({ error });
  //     }
  //     if (category) {
  //       Product.find({ category: category._id })
  //         .populate("category", "slug")
  //         .exec((error, products) => {
  //           if (error) {
  //             res.status(400).json({ error });
  //           }
  //           if (products.length > 0) {
  //             res.status(200).json({
  //               products,
  //             });
  //           }
  //         });
  //     } else {
  //       res.status(200).json({ message: `${slug} not available` });
  //     }
  //   });

  //v2.Passed
  const { slug } = req.params;
  //get category id of current slug.
  const catId = await Category.findOne({ slug: slug }).select("_id").exec();

  if (catId !== null) {
    //fetch all category to create category stack.
    const allCategory = await Category.find({});
    const formatedCategories = createCategories(allCategory);

    //fetch cateoryid and its sub-category id.
    const category = await getSelectedCategory(
      JSON.stringify(catId._id),
      formatedCategories
    );
    // fetch list of category and inner category.
    const categoryList = await extractInnerCategoryList(category);
    //get all product of this categories.
    product.find({ category: categoryList }).exec((err, products) => {
      if (err) {
        res.status(401).json({ err });
      }
      if (products) {
        res.status(200).json({ products });
      }
    });
  } else {
    res.status(400).json({ message: "no category with that name is found" });
  }
};

exports.getProductById = async (req, res) => {
  const { id } = req.params;
  //fetch individual product by its ID.
  await Product.findOne({ _id: id })
    .populate("category", "slug")
    .exec((err, data) => {
      if (err) {
        err.msg = "data not found in database collection";
        res.status(401).json({ err });
      }
      if (data) {
        res.status(200).json({ data });
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

//fetch all featured product.
exports.getFeaturedProducts = async (req, res) => {
  const product = await Product.find({ isfeatured: true })
    .populate("category", "slug")
    .exec();
  //console.log(product);
  res.status(200).json({ product });
};

//product based on category id.
exports.getProductByCategoryId = async (req, res) => {
  const arr = req.body.featuredCategory;
  const categoryWithProduct = [];
  for (let i = 0; i < arr.length; i++) {
    const result = await Product.find({ category: arr[i]._id })
      .populate("category", "slug")
      .exec();
    let newCatWithProduct = { ...arr[i], product: result };
    categoryWithProduct.push(newCatWithProduct);
  }
  res.status(200).send(categoryWithProduct);
};

exports.deleteProduct = async (req, res) => {
  console.log("api reached");

  //delete product image from Upload directory.
  if (req.body.productPictures.length > 0) {
    req.body.productPictures.forEach((element) => {
      if (
        fs.existsSync(
          path.join(path.dirname(__dirname), "uploads/") + element.img
        )
      ) {
        fs.unlink(
          path.join(path.dirname(__dirname), "uploads/") + element.img,
          (err) => {
            if (err) {
              // return res.status(400).json({ err });
              console.log(err);
            }
          }
        );
      }
    });
  }

  //delete product data from database
  Product.findByIdAndRemove(req.body._id, (err, data) => {
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

//create CategoryList with Sub category
function createCategories(categories, parentId = null) {
  //recursive function to stack children category under parent category.
  const categoryList = [];
  let category;
  if (parentId == null) {
    category = categories.filter((cat) => cat.parentId == undefined);
  } else {
    category = categories.filter((cat) => cat.parentId == parentId);
  }

  for (let cate of category) {
    categoryList.push({
      _id: cate._id,
      name: cate.name,
      slug: cate.slug,
      parentId: cate.parentId,
      type: cate.type ? cate.type : "undefined", // change this later
      children: createCategories(categories, cate._id), // recursive
    });
  }

  return categoryList;
}

const getSelectedCategory = async (categoryId, formatedCategories) => {
  //get selected category along with is children category.
  /**
   *loop through all category and iner category and when the id  matched imidiately return it.
   */

  //closure is sused because recurse function return statement could not be accurate.
  let result = [];
  function recurseCategory(categoryId, formatedCategories) {
    for (let i = 0; i < formatedCategories.length; i++) {
      if (JSON.stringify(formatedCategories[i]._id) == categoryId) {
        result.push(formatedCategories[i]);
      }

      if (formatedCategories[i].children.length > 0) {
        recurseCategory(categoryId, formatedCategories[i].children);
      }
    }
  }
  recurseCategory(categoryId, formatedCategories);
  return result;
};

const extractInnerCategoryList = async (category) => {
  let categoryArray = category;
  const categoryList = [];
  function recurseArray(categoryArray) {
    for (let i = 0; i < categoryArray.length; i++) {
      categoryList.push(categoryArray[i]._id);
      if (categoryArray[i].children.length > 0) {
        recurseArray(categoryArray[i].children);
      }
    }
  }
  recurseArray(categoryArray);
  return categoryList;
};

//v2.Testing-- delete later
// exports.getCategoryChildrenWithProduct = async (req, res) => {
//   const { slug, catid } = req.body;
//   //get category id of current slug.
//   const catId = await Category.findOne({ slug: slug }).select("_id").exec();

//   if (catId !== null) {
//     //fetch all category to create category stack.
//     const allCategory = await Category.find({});
//     const formatedCategories = createCategories(allCategory);

//     //fetch cateoryid and its sub-category id.
//     const category = await getSelectedCategory(
//       JSON.stringify(catId._id),
//       formatedCategories
//     );

//     // fetch list of category and inner category.
//     const categoryList = await extractInnerCategoryList(category);
//     //get all product of this categories.
//     product.find({ category: categoryList }).exec((err, data) => {
//       if (err) {
//         res.status(401).json({ err });
//       }
//       if (data) {
//         res.status(200).json({ data });
//       }
//     });
//   } else {
//     res.status(400).json({ message: "no category with that name is found" });
//   }
// };
