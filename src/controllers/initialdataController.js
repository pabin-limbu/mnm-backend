const Cateory = require("../models/category");
const Product = require("../models/product");
//function
function createCategories(categories, parentId = null) {
  // console.log(categories);
  //recursive function to stack children category under parent category.
  const categoryList = [];
  let category;
  /** AS the parent category will not have parent id so all category without parent id will be filtered and fetched from all categries.
       *cycle through eact parent category--> while checking a children category we call this function again but send current parent id and all categories in arguement.
       this time it has parent id to compare and if matched with all categories list push sub category iside parent category and do this until parent id dont match with any category.
       --> when no match is found the for loop jumps to new parent category and check for its child category as before. 
       */

  if (parentId == null) {
    category = categories.filter((cat) => cat.parentId == undefined);
    // console.log(category)
  } else {
    category = categories.filter((cat) => cat.parentId == parentId);
    //console.log(category);
  }

  for (let cate of category) {
    //  console.log(cate);
    categoryList.push({
      _id: cate._id,
      name: cate.name,
      slug: cate.slug,
      parentId: cate.parentId,
      type: cate.type ? cate.type : "undefined", // change this later.
      isfeatured: cate.isfeatured ? cate.isfeatured : "false",
      children: createCategories(categories, cate._id),
    });
  }

  return categoryList;
}

exports.initialData = async (req, res) => {
  const categories = await Cateory.find({}).exec();
  const products = await Product.find({})
    .select(
      "_id name quantity slug price description productPictures category isfeatured"
    )
    .populate({ path: "category", select: "_id name" })
    .exec();
  //console.log(categories);
  res.status(200).json({ categories: createCategories(categories), products });
};

exports.clientinitialData = async (req, res) => {
  const categories = await Cateory.find({}).exec();
  const products = await Product.find({})
    .select(
      "_id name quantity slug price description productPictures category isfeatured"
    )
    .populate({ path: "category", select: "_id name" })
    .exec();

    
  //console.log(categories);
  res.status(200).json({ categories: createCategories(categories), products });
};
