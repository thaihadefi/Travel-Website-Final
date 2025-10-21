const ContactMessage = require("../../models/contact-message.model");
const moment = require("moment");
const { paginationLimit } = require("../../config/variable.config");

module.exports.list = async (req, res) => {
  const find = {
    deleted: false
  };

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
    find.email = keywordRegex;
  }
  // End Search

  // Pagination
  const limitItems = paginationLimit.limitItemsAdmin;
  let page = 1;
  if(req.query.page && parseInt(req.query.page) > 0) {
    page = parseInt(req.query.page);
  }
  const skip = (page - 1) * limitItems;
  const totalRecord = await ContactMessage.countDocuments(find);
  const totalPage = Math.ceil(totalRecord/limitItems);
  const pagination = {
    skip: skip,
    totalRecord: totalRecord,
    totalPage: totalPage
  };
  // End Pagination

  const messageList = await ContactMessage
    .find(find)
    .sort({
      createdAt: "desc"
    })
    .limit(limitItems)
    .skip(skip)

  for (const item of messageList) {
    item.createdAtFormat = moment(item.createdAt).format("HH:mm - DD/MM/YYYY");
  }

  // Add current count and page to pagination
  pagination.currentCount = messageList.length;
  pagination.currentPage = page;

  res.render("admin/pages/message-list", {
    pageTitle: "Message Management",
    messageList: messageList,
    pagination: pagination
  });
}

module.exports.changeMultiPatch = async (req, res) => {
  try {
    const { value, ids } = req.body;

    switch (value) {
      case "delete":
        await ContactMessage.updateMany({
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
        await ContactMessage.updateMany({
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
        await ContactMessage.deleteMany({
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
    const id = req.params.id;

    await ContactMessage.updateOne({
      _id: id
    }, {
      deleted: true,
      deletedAt: Date.now()
    });
    
    res.json({
      code: "success",
      message: "Delete message successfully!"
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
  const totalRecord = await ContactMessage.countDocuments(find);
  const totalPage = Math.ceil(totalRecord/limitItems);
  const pagination = {
    skip: skip,
    totalRecord: totalRecord,
    totalPage: totalPage
  };
  // End Pagination

  const messageList = await ContactMessage
    .find(find)
    .sort({
      deletedAt: "desc"
    })
    .limit(limitItems)
    .skip(skip)

  for (const item of messageList) {
    item.createdAtFormat = moment(item.createdAt).format("HH:mm - DD/MM/YYYY");
    item.deletedAtFormat = moment(item.deletedAt).format("HH:mm - DD/MM/YYYY");
  }

  // Add current count and page to pagination
  pagination.currentCount = messageList.length;
  pagination.currentPage = page;

  res.render("admin/pages/message-trash", {
    pageTitle: "Message Trash",
    messageList: messageList,
    pagination: pagination
  });
}

module.exports.undoPatch = async (req, res) => {
  try {
    const id = req.params.id;

    await ContactMessage.updateOne({
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

    await ContactMessage.deleteOne({
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
