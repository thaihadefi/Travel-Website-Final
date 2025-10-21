const SettingWebsiteInfo = require("../../models/setting-website-info.model");
const { permissionList, paginationLimit } = require("../../config/variable.config");
const Role = require("../../models/role.model");
const bcrypt = require("bcryptjs");
const AccountAdmin = require("../../models/account-admin.model");
const Category = require("../../models/category.model");
const categoryHelper = require("../../helpers/category.helper");
const moment = require("moment");

module.exports.list = async (req, res) => {
  res.render("admin/pages/setting-list", {
    pageTitle: "Settings"
  });
}

module.exports.websiteInfo = async (req, res) => {
  const record = await SettingWebsiteInfo.findOne({});

  // Category list
  const categoryList = await Category.find({});
  const categoryTree = categoryHelper.buildCategoryTree(categoryList, "");
  // End Category list

  res.render("admin/pages/setting-website-info", {
    pageTitle: "Website Information",
    record: record,
    categoryList: categoryTree
  });
}

module.exports.websiteInfoPatch = async (req, res) => {
  try {
    if(req.files && req.files.logo) {
      req.body.logo = req.files.logo[0].path;
    }

    if(req.files && req.files.favicon) {
      req.body.favicon = req.files.favicon[0].path;
    }

    if(req.files && req.files.backgroundSection1) {
      req.body.backgroundSection1 = req.files.backgroundSection1[0].path;
    }

    if(req.files && req.files.bannersSection3) {
      req.body.bannersSection3 = req.files.bannersSection3.map(file => file.path);
    }

    if(req.files && req.files.bannerSection5) {
      req.body.bannerSection5 = req.files.bannerSection5[0].path;
    }

    if(req.files && req.files.bannerSection7) {
      req.body.bannerSection7 = req.files.bannerSection7[0].path;
    }

    const countRecord = await SettingWebsiteInfo.countDocuments({});
    if(countRecord > 0) {
      await SettingWebsiteInfo.updateOne({}, req.body, { upsert: true, setDefaultsOnInsert: true });
    } else {
      const newRecord = new SettingWebsiteInfo(req.body);
      await newRecord.save();
    }

    res.json({
      code: "success",
      message: "Update successfully!"
    })
  } catch (error) {
    console.log(error);
    res.json({
      code: "error",
      message: "Invalid data!"
    })
  }
}

module.exports.accountAdminList = async (req, res) => {
  const find = {
    deleted: false
  };

  // Filter by Status
  if(req.query.status) {
    find.status = req.query.status;
  }
  // End Filter by Status

  // Filter by Role
  if(req.query.role) {
    find.role = req.query.role;
  }
  // End Filter by Role

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
    const keywordRegex = new RegExp(req.query.keyword, "i");
    find.$or = [
      { fullName: keywordRegex },
      { email: keywordRegex }
    ];
  }
  // End Search

  // Pagination
  const limitItems = paginationLimit.limitItemsAdmin;
  let page = 1;
  if(req.query.page && parseInt(req.query.page) > 0) {
    page = parseInt(req.query.page);
  }
  const skip = (page - 1) * limitItems;
  const totalRecord = await AccountAdmin.countDocuments(find);
  const totalPage = Math.ceil(totalRecord/limitItems);
  const pagination = {
    skip: skip,
    totalRecord: totalRecord,
    totalPage: totalPage
  };
  // End Pagination

  const accountAdminList = await AccountAdmin
    .find(find)
    .sort({
      createdAt: "desc"
    })
    .limit(limitItems)
    .skip(skip)

  for (const item of accountAdminList) {
    if(item.role) {
      const roleInfo = await Role.findOne({
        _id: item.role
      })
      if(roleInfo) {
        item.roleName = roleInfo.name;
      }
    }
  }

  // Add current count and page to pagination
  pagination.currentCount = accountAdminList.length;
  pagination.currentPage = page;

  // List role for filter
  const roleListFilter = await Role.find({ deleted: false });
  // End list

  res.render("admin/pages/setting-account-admin-list", {
    pageTitle: "Account Admin",
    accountAdminList: accountAdminList,
    pagination: pagination,
    roleList: roleListFilter
  });
}

module.exports.accountAdminCreate = async (req, res) => {
  const roleList = await Role
    .find({
      deleted: false
    })
    .sort({
      createdAt: "desc"
    })

  res.render("admin/pages/setting-account-admin-create", {
    pageTitle: "Create Account Admin",
    roleList: roleList
  });
}

module.exports.accountAdminCreatePost = async (req, res) => {
  try {
    const existAccount = await AccountAdmin.findOne({
      email: req.body.email
    })

    if(existAccount) {
      res.json({
        code: "error",
        message: "Email already exists in the system!"
      })
      return;
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    req.body.password = await bcrypt.hash(req.body.password, salt);

    req.body.createdBy = req.account.id;
    req.body.updatedBy = req.account.id;
    req.body.avatar = req.file ? req.file.path : "";

    const newRecord = new AccountAdmin(req.body);
    await newRecord.save();

    res.json({
      code: "success",
      message: "Create account successfully!"
    })
  } catch (error) {
    res.json({
      code: "error",
      message: "Invalid data!"
    })
  }
}

module.exports.accountAdminEdit = async (req, res) => {
  try {
    const id = req.params.id;

    const accountDetail = await AccountAdmin.findOne({
      _id: id,
      deleted: false
    })

    if(!accountDetail) {
      res.redirect(`/${pathAdmin}/setting/account-admin/list`);
      return;
    }

    const roleList = await Role
      .find({
        deleted: false
      })
      .sort({
        createdAt: "desc"
      })

    res.render("admin/pages/setting-account-admin-edit", {
      pageTitle: "Edit Account Admin",
      roleList: roleList,
      accountDetail: accountDetail
    });
  } catch (error) {
    res.redirect(`/${pathAdmin}/setting/account-admin/list`);
  }
}

module.exports.accountAdminEditPatch = async (req, res) => {
  try {
    const id = req.params.id;

    const accountDetail = await AccountAdmin.findOne({
      _id: id,
      deleted: false
    })

    if(!accountDetail) {
      res.json({
        code: "error",
        message: "Record does not exist!"
      })
      return;
    }

    const existEmail = await AccountAdmin.findOne({
      _id: { $ne: id }, // ne: not equal
      email: req.body.email
    })

    if(existEmail) {
      res.json({
        code: "error",
        message: "Email already exists in the system!"
      })
      return;
    }

    if(req.body.password) {
      const salt = await bcrypt.genSalt(10);
      req.body.password = await bcrypt.hash(req.body.password, salt);
    } else {
      delete req.body.password;
    }

    req.body.updatedBy = req.account.id;
    
    if(req.file) {
      req.body.avatar = req.file.path;
    }

    await AccountAdmin.updateOne({
      _id: id
    }, req.body)

    res.json({
      code: "success",
      message: "Update account successfully!"
    })
  } catch (error) {
    res.json({
      code: "error",
      message: "Invalid data!"
    })
  }
}

module.exports.roleList = async (req, res) => {
  const find = {
    deleted: false
  };

  // Search
  if(req.query.keyword) {
    const keywordRegex = new RegExp(req.query.keyword, "i");
    find.name = keywordRegex;
  }
  // End Search

  // Pagination
  const limitItems = paginationLimit.limitItemsAdmin;
  let page = 1;
  if(req.query.page && parseInt(req.query.page) > 0) {
    page = parseInt(req.query.page);
  }
  const skip = (page - 1) * limitItems;
  const totalRecord = await Role.countDocuments(find);
  const totalPage = Math.ceil(totalRecord/limitItems);
  const pagination = {
    skip: skip,
    totalRecord: totalRecord,
    totalPage: totalPage
  };
  // End Pagination

  const roleList = await Role
    .find(find)
    .sort({
      createdAt: "desc"
    })
    .limit(limitItems)
    .skip(skip)

  // Add current count and page to pagination
  pagination.currentCount = roleList.length;
  pagination.currentPage = page;

  res.render("admin/pages/setting-role-list", {
    pageTitle: "Role List",
    roleList: roleList,
    pagination: pagination
  });
}

module.exports.roleCreate = async (req, res) => {
  res.render("admin/pages/setting-role-create", {
    pageTitle: "Create Role",
    permissionList: permissionList
  });
}

module.exports.roleCreatePost = async (req, res) => {
  try {
    req.body.createdBy = req.account.id;
    req.body.updatedBy = req.account.id;

    const newRecord = new Role(req.body);
    await newRecord.save();

    res.json({
      code: "success",
      message: "Create role successfully!"
    })
  } catch (error) {
    res.json({
      code: "error",
      message: "Invalid data!"
    })
  }
}

module.exports.roleEdit = async (req, res) => {
  try {
    const id = req.params.id;

    const roleDetail = await Role.findOne({
      _id: id,
      deleted: false
    })

    if(!roleDetail) {
      res.redirect(`/${pathAdmin}/setting/role/list`);
      return;
    }

    res.render("admin/pages/setting-role-edit", {
      pageTitle: "Edit Role",
      permissionList: permissionList,
      roleDetail: roleDetail
    });
  } catch (error) {
    res.redirect(`/${pathAdmin}/setting/role/list`);
  }
}

module.exports.roleEditPatch = async (req, res) => {
  try {
    const id = req.params.id;

    const roleDetail = await Role.findOne({
      _id: id,
      deleted: false
    })

    if(!roleDetail) {
      res.json({
        code: "error",
        message: "Record does not exist!"
      })
      return;
    }

    req.body.updatedBy = req.account.id;

    await Role.updateOne({
      _id: id,
      deleted: false
    }, req.body);

    res.json({
      code: "success",
      message: "Update role successfully!"
    })
  } catch (error) {
    res.json({
      code: "error",
      message: "Invalid data!"
    })
  }
}

module.exports.accountAdminChangeMultiPatch = async (req, res) => {
  try {
    const { value, ids } = req.body;

    switch (value) {
      case "active":
      case "inactive":
        await AccountAdmin.updateMany({
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
        await AccountAdmin.updateMany({
          _id: { $in: ids }
        }, {
          deleted: true,
          deletedAt: Date.now()
        })
        res.json({
          code: "success",
          message: "Delete successfully!"
        })
        break;
      case "undo":
        await AccountAdmin.updateMany({
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
        await AccountAdmin.deleteMany({
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

module.exports.roleChangeMultiPatch = async (req, res) => {
  try {
    const { value, ids } = req.body;

    switch (value) {
      case "delete":
        await Role.updateMany({
          _id: { $in: ids }
        }, {
          deleted: true,
          deletedAt: Date.now()
        })
        res.json({
          code: "success",
          message: "Delete successfully!"
        })
        break;
      case "undo":
        await Role.updateMany({
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
        await Role.deleteMany({
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

module.exports.accountAdminDeletePatch = async (req, res) => {
  try {
    const id = req.params.id;

    await AccountAdmin.updateOne({
      _id: id
    }, {
      deleted: true,
      deletedAt: Date.now(),
      deletedBy: req.account.id
    });
    
    res.json({
      code: "success",
      message: "Delete admin account successfully!"
    })
  } catch (error) {
    res.json({
      code: "error",
      message: "Invalid data!"
    })
  }
}

module.exports.roleDeletePatch = async (req, res) => {
  try {
    const id = req.params.id;

    await Role.updateOne({
      _id: id
    }, {
      deleted: true,
      deletedAt: Date.now(),
      deletedBy: req.account.id
    });
    
    res.json({
      code: "success",
      message: "Delete role successfully!"
    })
  } catch (error) {
    res.json({
      code: "error",
      message: "Invalid data!"
    })
  }
}

module.exports.accountAdminTrash = async (req, res) => {
  const moment = require("moment");
  
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
  const totalRecord = await AccountAdmin.countDocuments(find);
  const totalPage = Math.ceil(totalRecord/limitItems);
  const pagination = {
    skip: skip,
    totalRecord: totalRecord,
    totalPage: totalPage
  };
  // End Pagination

  const accountAdminList = await AccountAdmin
    .find(find)
    .sort({
      deletedAt: "desc"
    })
    .limit(limitItems)
    .skip(skip)

  for (const item of accountAdminList) {
    if(item.role_id) {
      const role = await Role.findOne({
        _id: item.role_id,
        deleted: false
      })
      if(role) {
        item.roleName = role.name;
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
  pagination.currentCount = accountAdminList.length;
  pagination.currentPage = page;

  res.render("admin/pages/setting-account-admin-trash", {
    pageTitle: "Admin Account Trash",
    accountAdminList: accountAdminList,
    pagination: pagination
  });
}

module.exports.accountAdminUndoPatch = async (req, res) => {
  try {
    const id = req.params.id;

    await AccountAdmin.updateOne({
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

module.exports.accountAdminDestroyDelete = async (req, res) => {
  try {
    const id = req.params.id;

    await AccountAdmin.deleteOne({
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

module.exports.roleTrash = async (req, res) => {
  const moment = require("moment");
  
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
  const totalRecord = await Role.countDocuments(find);
  const totalPage = Math.ceil(totalRecord/limitItems);
  const pagination = {
    skip: skip,
    totalRecord: totalRecord,
    totalPage: totalPage
  };
  // End Pagination

  const roleList = await Role
    .find(find)
    .sort({
      deletedAt: "desc"
    })
    .limit(limitItems)
    .skip(skip)

  for (const item of roleList) {
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
  pagination.currentCount = roleList.length;
  pagination.currentPage = page;

  res.render("admin/pages/setting-role-trash", {
    pageTitle: "Role Trash",
    roleList: roleList,
    pagination: pagination
  });
}

module.exports.roleUndoPatch = async (req, res) => {
  try {
    const id = req.params.id;

    await Role.updateOne({
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

module.exports.roleDestroyDelete = async (req, res) => {
  try {
    const id = req.params.id;

    await Role.deleteOne({
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