const Product = require("../models/product");
const Category = require("../models/category");

const slugify = require("slugify");
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

exports.getProductsBySlug = (req, res) => {
  const { slug } = req.params;
  Category.findOne({ slug: slug })
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
//fetch all featured product.
exports.getFeaturedProducts = async (req, res) => {
  const product = await Product.find({ isfeatured: true });
  //console.log(product);
  res.status(200).json({ product });
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

const getInnerCategoryBasedOnCategory = async (
  //test
  categoryId,
  formatedCategories
) => {
  let mainCat = null;
  let catArray = [];
  let validParentId = categoryId;

  const getCat = (categoryId, formatedCategories) => {
    for (let i = 0; i < formatedCategories.length; i++) {
      if (
        formatedCategories[i].parentId == validParentId ||
        formatedCategories[i]._id == categoryId
      ) {
        if (mainCat === null) {
          mainCat = formatedCategories[i].name;
          catArray.push({ [formatedCategories[i].name]: [] });
        } else {
          //  do nothing
        }
        catArray[0][mainCat].push(formatedCategories[i]._id);
        //catArray.push(formatedCategories[i]._id);

        if (formatedCategories[i].children.length > 0) {
          validParentId = formatedCategories[i]._id;
        }
      }
      if (formatedCategories[i].children.length > 0) {
        getCat(categoryId, formatedCategories[i].children);
      }
    }
  };
  getCat(categoryId, formatedCategories);
  return catArray;
};

//this is jst for test
const getCategoryWithItsChildren = (categoryId, formatedCategories) => {
  //test
  const getCat = (categoryId, formatedCategories) => {
    for (let i = 0; i < formatedCategories.length; i++) {
      if (formatedCategories[i]._id == categoryId) {
        return formatedCategories[i];
      }
      if (formatedCategories[i].children.length > 0) {
        getCat(categoryId, formatedCategories[i].children);
      }
    }
  };
  return getCat(categoryId, formatedCategories);
};

const getProductBasedOnCategory = async (cateroryList) => {
  //test
  let products = [];
  const value = await Product.find(
    {
      category: "6094e8d6b7471438ec34122f",
    },
    "_id name"
  ).exec();

  //console.log(value);
  // problem function is returning before the data is fetched.
  return value;
};

exports.getProductByCategory = async (req, res) => {
  //test
  const allCategory = await Category.find({}).exec();
  const formatedCategories = createCategories(allCategory);
  const { categoryId } = req.body;
  if (categoryId instanceof Array) {
  } else {
    //fetch category and check sub categories.
    const category = await getInnerCategoryBasedOnCategory(
      categoryId,
      formatedCategories
    );
    //console.log(category);

    //according to this arrray fetch all product related to it.
    const testresult = getCategoryWithItsChildren(
      categoryId,
      formatedCategories
    );
    console.log(testresult);

    const result = await getProductBasedOnCategory(category);
    // console.log(result);
    res.status(200).json({ result });
  }
};

exports.getProductByCategoryId = async (req, res) => {
  const arr = req.body.featuredCategory;
  const categoryWithProduct = [];
  for (let i = 0; i < arr.length; i++) {
    const result = await Product.find({ category: arr[i]._id }).exec();
    let newCatWithProduct = { ...arr[i], product: result };
    categoryWithProduct.push(newCatWithProduct);
  }

  res.status(200).send(categoryWithProduct);
};
