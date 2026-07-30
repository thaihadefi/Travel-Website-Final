const Category = require("../../models/category.model");
const AccountAdmin = require("../../models/account-admin.model");
const categoryHelper = require("../../helpers/category.helper");
const moment = require('moment');
const slugify = require('slugify');
const { paginationLimit } = require("../../config/variable.config");
const cloudinaryHelper = require("../../helpers/cloudinary.helper");

module.exports.list = async (req, res) => {
  const find = {
    deleted: false
  };

  // Filter by Status
  if(req.query.status) {
    find.status = req.query.status;
  }
  // End Filter by Status

  // Filter by Created By
  if(req.query.createdBy) {
    find.createdBy = req.query.createdBy;
  }
  // End Filter by Created By

  // Filter by Created At
  const filterDate = {};
  if(req.query.startDate) {
    const startDate = moment(req.query.startDate).toDate();
    filterDate.$gte = startDate;
    find.createdAt = filterDate;
  }
  if(req.query.endDate) {
    const endDate = moment(req.query.endDate).toDate();
    filterDate.$lte = endDate;
    find.createdAt = filterDate;
  }
  // End Filter by Created At

  // Search
  if(req.query.keyword) {
    const keyword = slugify(req.query.keyword);
    const keywordRegex = new RegExp(keyword, "i");
    find.slug = keywordRegex;
  }
  // End Search

  // Pagination
  const limitItems = paginationLimit.limitItemsAdmin;
  let page = 1;
  if(req.query.page && parseInt(req.query.page) > 0) {
    page = parseInt(req.query.page);
  }
  const skip = (page - 1) * limitItems;
  const totalRecord = await Category.countDocuments(find);
  const totalPage = Math.ceil(totalRecord/limitItems);
  const pagination = {
    skip: skip,
    totalRecord: totalRecord,
    totalPage: totalPage
  };
  // End Pagination

  const categoryList = await Category
    .find(find)
    .sort({
      position: "desc"
    })
    .limit(limitItems)
    .skip(skip)

  for (const item of categoryList) {
    if(item.createdBy) {
      const infoAccount = await AccountAdmin.findOne({
        _id: item.createdBy
      })
      if(infoAccount) {
        item.createdByFullName = infoAccount.fullName;
      }
    }

    if(item.updatedBy) {
      const infoAccount = await AccountAdmin.findOne({
        _id: item.updatedBy
      })
      if(infoAccount) {
        item.updatedByFullName = infoAccount.fullName;
      }
    }

    item.createdAtFormat = moment(item.createdAt).format("HH:mm - DD/MM/YYYY");
    item.updatedAtFormat = moment(item.updatedAt).format("HH:mm - DD/MM/YYYY");
  }

  // List account admin
  const accountAdminList = await AccountAdmin.find({});
  // End list account admin

  // Add current count and page to pagination
  pagination.currentCount = categoryList.length;
  pagination.currentPage = page;

  res.render("admin/pages/category-list", {
    pageTitle: "Category Management",
    categoryList: categoryList,
    accountAdminList: accountAdminList,
    pagination: pagination
  });
}

module.exports.create = async (req, res) => {
  const categoryList = await Category.find({});

  const categoryTree = categoryHelper.buildCategoryTree(categoryList, "");

  res.render("admin/pages/category-create", {
    pageTitle: "Create Category",
    categoryList: categoryTree
  });
}

module.exports.createPost = async (req, res) => {
  if(!req.permissions.includes("category-create")) {
    res.json({
      code: "error",
      message: "No permission!"
    })
    return;
  }

  if(req.body.position) {
    req.body.position = parseInt(req.body.position);
  } else {
    const totalRecord = await Category.countDocuments({});
    req.body.position = totalRecord + 1;
  }

  req.body.createdBy = req.account.id;
  req.body.updatedBy = req.account.id;
  req.body.avatar = req.file ? req.file.path : "";

  const newRecord = new Category(req.body);
  await newRecord.save();

  res.json({
    code: "success",
    message: "Category created successfully!"
  })
}

module.exports.edit = async (req, res) => {
  try {
    const id = req.params.id;

    const categoryDetail = await Category.findOne({
      _id: id,
      deleted: false
    })

    if(!categoryDetail) {
      res.redirect(`/${pathAdmin}/category/list`);
      return;
    }

    const categoryList = await Category.find({});

    const categoryTree = categoryHelper.buildCategoryTree(categoryList, "");

    res.render("admin/pages/category-edit", {
      pageTitle: "Edit Category",
      categoryList: categoryTree,
      categoryDetail: categoryDetail
    });
  } catch (error) {
    res.redirect(`/${pathAdmin}/category/list`);
  }
}

module.exports.editPatch = async (req, res) => {
  try {
    if(!req.permissions.includes("category-edit")) {
      res.json({
        code: "error",
        message: "No permission!"
      })
      return;
    }

    const id = req.params.id;

    if(req.body.position) {
      req.body.position = parseInt(req.body.position);
    } else {
      const totalRecord = await Category.countDocuments({});
      req.body.position = totalRecord + 1;
    }

    req.body.updatedBy = req.account.id;
    if(req.file) {
      req.body.avatar = req.file.path;
    } else {
      delete req.body.avatar;
    }

    await Category.updateOne({
      _id: id,
      deleted: false
    }, req.body);
    
    res.json({
      code: "success",
      message: "Update successful!"
    })
  } catch (error) {
    res.json({
      code: "error",
      message: "Invalid data!"
    })
  }
}

module.exports.deletePatch = async (req, res) => {
  try {
    const id = req.params.id;

    await Category.updateOne({
      _id: id
    }, {
      deleted: true,
      deletedAt: Date.now(),
      deletedBy: req.account.id
    });
    
    res.json({
      code: "success",
      message: "Category deleted successfully!"
    })
  } catch (error) {
    res.json({
      code: "error",
      message: "Invalid data!"
    })
  }
}

module.exports.changeMultiPatch = async (req, res) => {
  try {
    const { value, ids } = req.body;

    const editValues = ["active", "inactive", "undo"];
    const deleteValues = ["delete", "destroy"];
    if(editValues.includes(value) && !req.permissions.includes("category-edit")) {
      res.json({ code: "error", message: "No permission!" })
      return;
    }
    if(deleteValues.includes(value) && !req.permissions.includes("category-delete")) {
      res.json({ code: "error", message: "No permission!" })
      return;
    }

    switch (value) {
      case "active":
      case "inactive":
        await Category.updateMany({
          _id: { $in: ids }
        }, {
          status: value
        })
        res.json({
          code: "success",
          message: "Change status successfully!"
        })
        break;
      case "delete":
        await Category.updateMany({
          _id: { $in: ids }
        }, {
          deleted: true,
          deletedAt: Date.now(),
          deletedBy: req.account.id
        })
        res.json({
          code: "success",
          message: "Delete successfully!"
        })
        break;
      case "undo":
        await Category.updateMany({
          _id: { $in: ids }
        }, {
          deleted: false
        })
        res.json({
          code: "success",
          message: "Restore successfully!"
        })
        break;
      case "destroy":
        // Get all categories to delete avatars from Cloudinary
        const categoriesToDestroy = await Category.find({ _id: { $in: ids } });
        
        // Delete avatars from Cloudinary
        for (const category of categoriesToDestroy) {
          if (category.avatar) {
            await cloudinaryHelper.deleteImage(category.avatar);
          }
        }
        
        await Category.deleteMany({
          _id: { $in: ids }
        })
        res.json({
          code: "success",
          message: "Delete permanently successfully!"
        })
        break;
      default:
        res.json({
          code: "error",
          message: "Invalid data!"
        })
        break;
    }
  } catch (error) {
    res.json({
      code: "error",
      message: "Invalid data!"
    })
  }
}

module.exports.deletePatch = async (req, res) => {
  try {
    if(!req.permissions.includes("category-delete")) {
      res.json({
        code: "error",
        message: "No permission!"
      })
      return;
    }

    const id = req.params.id;

    await Category.updateOne({
      _id: id
    }, {
      deleted: true,
      deletedAt: Date.now(),
      deletedBy: req.account.id
    });

    res.json({
      code: "success",
      message: "Delete category successfully!"
    })
  } catch (error) {
    res.json({
      code: "error",
      message: "Invalid data!"
    })
  }
}

module.exports.trash = async (req, res) => {
  const find = {
    deleted: true
  };

  // Pagination
  const limitItems = paginationLimit.limitItemsAdmin;
  let page = 1;
  if(req.query.page && parseInt(req.query.page) > 0) {
    page = parseInt(req.query.page);
  }
  const skip = (page - 1) * limitItems;
  const totalRecord = await Category.countDocuments(find);
  const totalPage = Math.ceil(totalRecord/limitItems);
  const pagination = {
    skip: skip,
    totalRecord: totalRecord,
    totalPage: totalPage
  };
  // End Pagination

  const categoryList = await Category
    .find(find)
    .sort({
      deletedAt: "desc"
    })
    .limit(limitItems)
    .skip(skip)

  for (const item of categoryList) {
    if(item.deletedBy) {
      const infoAccount = await AccountAdmin.findOne({
        _id: item.deletedBy
      })
      if(infoAccount) {
        item.deletedByFullName = infoAccount.fullName;
      }
    }

    item.createdAtFormat = moment(item.createdAt).format("HH:mm - DD/MM/YYYY");
    item.deletedAtFormat = moment(item.deletedAt).format("HH:mm - DD/MM/YYYY");
  }

  // Add current count and page to pagination
  pagination.currentCount = categoryList.length;
  pagination.currentPage = page;

  res.render("admin/pages/category-trash", {
    pageTitle: "Category Trash",
    categoryList: categoryList,
    pagination: pagination
  });
}

module.exports.undoPatch = async (req, res) => {
  try {
    if(!req.permissions.includes("category-edit")) {
      res.json({
        code: "error",
        message: "No permission!"
      })
      return;
    }

    const id = req.params.id;

    await Category.updateOne({
      _id: id
    }, {
      deleted: false
    });
    
    res.json({
      code: "success",
      message: "Restore successfully!"
    })
  } catch (error) {
    res.json({
      code: "error",
      message: "Invalid data!"
    })
  }
}

module.exports.destroyDelete = async (req, res) => {
  try {
    if(!req.permissions.includes("category-delete")) {
      res.json({
        code: "error",
        message: "No permission!"
      })
      return;
    }

    const id = req.params.id;

    // Get category info to delete avatar from Cloudinary
    const category = await Category.findOne({ _id: id });
    
    if (category && category.avatar) {
      await cloudinaryHelper.deleteImage(category.avatar);
    }

    await Category.deleteOne({
      _id: id
    });
    
    res.json({
      code: "success",
      message: "Delete permanently successfully!"
    })
  } catch (error) {
    res.json({
      code: "error",
      message: "Invalid data!"
    })
  }
}