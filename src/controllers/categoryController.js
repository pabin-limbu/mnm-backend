const slugify = require("slugify");
const Category = require("../models/category");
const shortid = require("shortid");

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

//add category
exports.addCategory = (req, res) => {
  // console.log(req.body);
  //const categoryObj = { name: req.body.name, slug: slugify(req.body.name) }; -- without short id
  const categoryObj = {
    name: req.body.name,
    slug: `${slugify(req.body.name)}-${shortid.generate()}`,
  };

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

//edit category
exports.updateCategories = async (req, res) => {
  const { _id, name, parentId, type, isfeatured } = req.body;

  const updatedCategories = [];
  //if multipple category is targeted. check id request body is an array.

  if (name instanceof Array) {
    for (let i = 0; i < name.length; i++) {
      const category = {
        name: name[i],
        type: type[i],
        isfeatured: isfeatured[i],
      };
      //check if parentId is undefined of an empty string.
      // since the request body will be received in a string format so the null comparision should be on string aaswell.
      if (parentId[i] != "null") {
        category.parentId = parentId[i];
      }
      //update category based on the _id ,send category updated  information and return new updated category : true.
      const updatedCategory = await Category.findOneAndUpdate(
        { _id: _id[i] },
        category,
        { new: true }
      );

      updatedCategories.push(updatedCategory);
    }
    return res.status(201).json({ updatedCategories });
  } else {
    //if the selected category t be updated is single selection.
    const category = { name, type };
    if (parentId != "null") {
      category.parentId = parentId;
    }

    const updatedCategory = await Category.findOneAndUpdate({ _id }, category, {
      new: true,
    });

    return res.status(201).json({ updatedCategory });
  }
};

exports.deleteCategories = async (req, res) => {
  const { ids } = req.body.payload;
  const deletedCategories = [];
  for (let i = 0; i < ids.length; i++) {
    const deleteCategory = await Category.findOneAndDelete({ _id: ids[i]._id });
    deletedCategories.push(deleteCategory);
  }
  if (deletedCategories.length == ids.length) {
    res.status(201).json({ message: "category removed" });
  } else {
    res
      .status(400)
      .json({ message: "Somethong went wrong - cat controller  " });
  }
};
