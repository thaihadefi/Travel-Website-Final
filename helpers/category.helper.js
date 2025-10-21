const Category = require("../models/category.model");

// buildCategoryTree
const buildCategoryTree = (categories, parentId = "") => {
  // Create an array to store the subcategories
  const tree = [];

  // Loop through each category in the array
  categories.forEach(item => {
    // If the parent of the current category matches the parentId
    if (item.parent === parentId) {
      // Recursively find subcategories of current category
      const children = buildCategoryTree(categories, item.id);

      // Add current category to tree along with subcategories
      tree.push({
        id: item.id,
        name: item.name,
        slug: item.slug,
        children: children, // Attach children array (can be empty)
      });
    }
  });

  // Return the category tree
  return tree;
}
module.exports.buildCategoryTree = buildCategoryTree;
// End buildCategoryTree

// getCategoryChild
const getCategoryChild = async (parentId) => {
  const result = [];

  const childList = await Category
    .find({
      parent: parentId,
      deleted: false,
      status: "active"
    })

  for (const item of childList) {
    result.push({
      id: item.id,
      name: item.name,
    });
    await getCategoryChild(item.id);
  }

  return result;
}
module.exports.getCategoryChild = getCategoryChild;
// End getCategoryChild

// getCategoryParent
const getCategoryParent = async (parentId) => {
  const result = [];

  const categoryParent = await Category.findOne({
    _id: parentId,
    deleted: false
  })

  if(categoryParent) {
    result.unshift({
      id: categoryParent.id,
      name: categoryParent.name,
      avatar: categoryParent.avatar,
      slug: categoryParent.slug,
    });
    if(categoryParent.parent) {
      const resultParent = await getCategoryParent(categoryParent.parent);
      if(resultParent.length > 0) {
        result.unshift(resultParent[0]);
      }
    }
  }

  return result;
}
module.exports.getCategoryParent = getCategoryParent;
// End getCategoryParent