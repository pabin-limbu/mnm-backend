const slugify = require("slugify");
const Category = require("../models/category");

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
      children: createCategories(categories, cate._id), // recursive
    });
  }

  return categoryList;
}

//add category
exports.addCategory = (req, res) => {
  const categoryObj = { name: req.body.name, slug: slugify(req.body.name) };

  if (req.body.parentId) {
    categoryObj.parentId = req.body.parentId;
  }

  const cat = new Category(categoryObj);
  cat.save((error, category) => {
    if (error) {
      return res.status(400).json({ error });
    }

    if (category) {
      return res.status(201).json({ category });
    }
  });
};

//fetch all categories and return with sub categories
exports.getCategories = (req, res) => {
  Category.find({}).exec((error, categories) => {
    if (error) {
      return res.status(400).json({ error });
    }

    if (categories) {
      const categoryList = createCategories(categories); //to create a category-->subcategory.
      //console.log(categoryList[0]);
      return res.status(200).json({ categoryList });
    }
  });
};
//fetch all categories and return normal list
exports.getCategoriesLinearList = (req, res) => {
  Category.find({}).exec((error, categories) => {
    if (error) {
      return res.status(400).json({ error });
    }
    return res.status(200).json({ categories });
  });
};
