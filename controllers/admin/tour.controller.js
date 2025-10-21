const Category = require("../../models/category.model");
const categoryHelper = require("../../helpers/category.helper");
const City = require("../../models/city.model");
const Tour = require("../../models/tour.model");
const AccountAdmin = require("../../models/account-admin.model");
const moment = require('moment');
const slugify = require('slugify');
const { paginationLimit } = require("../../config/variable.config");

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

  // Filter by Category
  if(req.query.category) {
    find.category = req.query.category;
  }
  // End Filter by Category

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
  const totalRecord = await Tour.countDocuments(find);
  const totalPage = Math.ceil(totalRecord/limitItems);
  const pagination = {
    skip: skip,
    totalRecord: totalRecord,
    totalPage: totalPage
  };
  // End Pagination

  const tourList = await Tour
    .find(find)
    .sort({
      position: "desc"
    })
    .limit(limitItems)
    .skip(skip)

  for (const item of tourList) {
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

  // Add current count and page to pagination
  pagination.currentCount = tourList.length;
  pagination.currentPage = page;

  // List category and account admin for filter
  const categoryList = await Category.find({ deleted: false });
  const accountAdminList = await AccountAdmin.find({ deleted: false });
  // End list

  res.render("admin/pages/tour-list", {
    pageTitle: "Tour Management",
    tourList: tourList,
    pagination: pagination,
    categoryList: categoryList,
    accountAdminList: accountAdminList
  });
}

module.exports.create = async (req, res) => {
  const categoryList = await Category.find({});
  
  const categoryTree = categoryHelper.buildCategoryTree(categoryList, "");

  const cityList = await City.find({}).sort({ name: "asc" });

  res.render("admin/pages/tour-create", {
    pageTitle: "Create tour",
    categoryList: categoryTree,
    cityList: cityList
  });
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
  const totalRecord = await Tour.countDocuments(find);
  const totalPage = Math.ceil(totalRecord/limitItems);
  const pagination = {
    skip: skip,
    totalRecord: totalRecord,
    totalPage: totalPage
  };
  // End Pagination

  const tourList = await Tour
    .find(find)
    .sort({
      deletedAt: "desc"
    })
    .limit(limitItems)
    .skip(skip)

  for (const item of tourList) {
    if(item.createdBy) {
      const infoAccount = await AccountAdmin.findOne({
        _id: item.createdBy
      })
      if(infoAccount) {
        item.createdByFullName = infoAccount.fullName;
      }
    }

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
  pagination.currentCount = tourList.length;
  pagination.currentPage = page;
  
  res.render("admin/pages/tour-trash", {
    pageTitle: "Tour Trash",
    tourList: tourList,
    pagination: pagination
  });
}

module.exports.createPost = async (req, res) => {
  try {
    if(!req.permissions.includes("tour-create")) {
      res.json({
        code: "error",
        message: "No permission!"
      })
      return;
    }
    
    if(req.body.position) {
      req.body.position = parseInt(req.body.position);
    } else {
      const totalRecord = await Tour.countDocuments({});
      req.body.position = totalRecord + 1;
    }

    req.body.priceAdult = req.body.priceAdult ? parseInt(req.body.priceAdult) : 0;
    req.body.priceChildren = req.body.priceChildren ? parseInt(req.body.priceChildren) : 0;
    req.body.priceBaby = req.body.priceBaby ? parseInt(req.body.priceBaby) : 0;
    req.body.priceNewAdult = req.body.priceNewAdult ? parseInt(req.body.priceNewAdult) : req.body.priceAdult;
    req.body.priceNewChildren = req.body.priceNewChildren ? parseInt(req.body.priceNewChildren) : req.body.priceChildren;
    req.body.priceNewBaby = req.body.priceNewBaby ? parseInt(req.body.priceNewBaby) : req.body.priceBaby;
    req.body.stockAdult = req.body.stockAdult ? parseInt(req.body.stockAdult) : 0;
    req.body.stockChildren = req.body.stockChildren ? parseInt(req.body.stockChildren) : 0;
    req.body.stockBaby = req.body.stockBaby ? parseInt(req.body.stockBaby) : 0;
    req.body.locations = req.body.locations ? JSON.parse(req.body.locations) : [];
    req.body.departureDate = req.body.departureDate ? new Date(req.body.departureDate) : null;
    req.body.schedules = req.body.schedules ? JSON.parse(req.body.schedules) : [];

    req.body.createdBy = req.account.id;
    req.body.updatedBy = req.account.id;
    if(req.files && req.files.avatar && req.files.avatar.length > 0) {
      req.body.avatar = req.files.avatar[0].path;
    } else {
      req.body.avatar = "";
    }

    if(req.files && req.files.images && req.files.images.length > 0) {
      req.body.images = req.files.images.map(item => item.path);
    } else {
      req.body.images = [];
    }

    const newRecord = new Tour(req.body);
    await newRecord.save();

    res.json({
      code: "success",
      message: "Create tour successfully!"
    })
  } catch (error) {
    res.json({
      code: "error",
      message: "Invalid data!"
    })
  }
}

module.exports.edit = async (req, res) => {
  try {
    const id = req.params.id;

    const tourDetail = await Tour.findOne({
      _id: id,
      deleted: false
    })

    if(!tourDetail) {
      res.redirect(`/${pathAdmin}/tour/list`);
      return;
    }

    if(tourDetail.departureDate) {
      tourDetail.departureDateFormat = moment(tourDetail.departureDate).format("YYYY-MM-DD");
    }

    const categoryList = await Category.find({});
  
    const categoryTree = categoryHelper.buildCategoryTree(categoryList, "");

    const cityList = await City.find({}).sort({ name: "asc" });

    res.render("admin/pages/tour-edit", {
      pageTitle: "Edit Tour",
      categoryList: categoryTree,
      tourDetail: tourDetail,
      cityList: cityList
    });
  } catch (error) {
    res.redirect(`/${pathAdmin}/tour/list`);
  }
}

module.exports.editPatch = async (req, res) => {
  try {
    if(!req.permissions.includes("tour-edit")) {
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
      const totalRecord = await Tour.countDocuments({});
      req.body.position = totalRecord + 1;
    }

    req.body.priceAdult = req.body.priceAdult ? parseInt(req.body.priceAdult) : 0;
    req.body.priceChildren = req.body.priceChildren ? parseInt(req.body.priceChildren) : 0;
    req.body.priceBaby = req.body.priceBaby ? parseInt(req.body.priceBaby) : 0;
    req.body.priceNewAdult = req.body.priceNewAdult ? parseInt(req.body.priceNewAdult) : req.body.priceAdult;
    req.body.priceNewChildren = req.body.priceNewChildren ? parseInt(req.body.priceNewChildren) : req.body.priceChildren;
    req.body.priceNewBaby = req.body.priceNewBaby ? parseInt(req.body.priceNewBaby) : req.body.priceBaby;
    req.body.stockAdult = req.body.stockAdult ? parseInt(req.body.stockAdult) : 0;
    req.body.stockChildren = req.body.stockChildren ? parseInt(req.body.stockChildren) : 0;
    req.body.stockBaby = req.body.stockBaby ? parseInt(req.body.stockBaby) : 0;
    req.body.locations = req.body.locations ? JSON.parse(req.body.locations) : [];
    req.body.departureDate = req.body.departureDate ? new Date(req.body.departureDate) : null;
    req.body.schedules = req.body.schedules ? JSON.parse(req.body.schedules) : [];
    req.body.updatedBy = req.account.id;
    req.body.avatar = req.file ? req.file.path : "";
    if(req.files && req.files.avatar && req.files.avatar.length > 0) {
      req.body.avatar = req.files.avatar[0].path;
    } else {
      delete req.body.avatar;
    }

    if(req.files && req.files.images && req.files.images.length > 0) {
      req.body.images = req.files.images.map(item => item.path);
    } else {
      delete req.body.images;
    }

    await Tour.updateOne({
      _id: id,
      deleted: false
    }, req.body);
    
    res.json({
      code: "success",
      message: "Update successfully!"
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
    if(!req.permissions.includes("tour-delete")) {
      res.json({
        code: "error",
        message: "No permission!"
      })
      return;
    }
    
    const id = req.params.id;

    await Tour.updateOne({
      _id: id
    }, {
      deleted: true,
      deletedAt: Date.now(),
      deletedBy: req.account.id
    });
    
    res.json({
      code: "success",
      message: "Delete tour successfully!"
    })
  } catch (error) {
    res.json({
      code: "error",
      message: "Invalid data!"
    })
  }
}

module.exports.undoPatch = async (req, res) => {
  try {
    const id = req.params.id;

    await Tour.updateOne({
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
    const id = req.params.id;

    await Tour.deleteOne({
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

module.exports.changeMultiPatch = async (req, res) => {
  try {
    const { value, ids } = req.body;

    switch (value) {
      case "active":
      case "inactive":
        await Tour.updateMany({
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
        await Tour.updateMany({
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
        await Tour.updateMany({
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
        await Tour.deleteMany({
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