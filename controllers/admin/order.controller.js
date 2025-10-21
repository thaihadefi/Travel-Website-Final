const Order = require("../../models/order.model");
const City = require("../../models/city.model");
const { paymentMethodList, paymentStatusList, statusList, paginationLimit } = require("../../config/variable.config");
const moment = require("moment");

module.exports.list = async (req, res) => {
  const find = {
    deleted: false
  };

  // Filter by Status
  if(req.query.status) {
    find.status = req.query.status;
  }
  // End Filter by Status

  // Filter by Payment Method
  if(req.query.paymentMethod) {
    find.paymentMethod = req.query.paymentMethod;
  }
  // End Filter by Payment Method

  // Filter by Payment Status
  if(req.query.paymentStatus) {
    find.paymentStatus = req.query.paymentStatus;
  }
  // End Filter by Payment Status

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
      { code: keywordRegex },
      { fullName: keywordRegex },
      { phone: keywordRegex }
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
  const totalRecord = await Order.countDocuments(find);
  const totalPage = Math.ceil(totalRecord/limitItems);
  const pagination = {
    skip: skip,
    totalRecord: totalRecord,
    totalPage: totalPage
  };
  // End Pagination

  const orderList = await Order
    .find(find)
    .sort({
      createdAt: "desc"
    })
    .limit(limitItems)
    .skip(skip)

  for (const orderDetail of orderList) {
    orderDetail.paymentMethodName = paymentMethodList.find(item => item.value == orderDetail.paymentMethod).label;
    orderDetail.paymentStatusName = paymentStatusList.find(item => item.value == orderDetail.paymentStatus).label;
    orderDetail.statusInfo = statusList.find(item => item.value == orderDetail.status);
    orderDetail.createdAtTime = moment(orderDetail.createdAt).format("HH:mm");
    orderDetail.createdAtDate = moment(orderDetail.createdAt).format("DD/MM/YYYY");
  }

  // Add current count and page to pagination
  pagination.currentCount = orderList.length;
  pagination.currentPage = page;

  res.render("admin/pages/order-list", {
    pageTitle: "Order Management",
    orderList: orderList,
    pagination: pagination
  });
}

module.exports.edit = async (req, res) => {
  try {
    const id = req.params.id;

    const orderDetail = await Order.findOne({
      _id: id,
      deleted: false
    })

    if(!orderDetail) {
      res.redirect(`/${pathAdmin}/order/list`);
      return;
    }

    orderDetail.createdAtFormat = moment(orderDetail.createdAt).format("YYYY-MM-DDTHH:mm");

    for (const item of orderDetail.items) {
      item.departureDateFormat = moment(item.departureDate).format("DD/MM/YYYY");
      const city = await City.findOne({
        _id: item.locationFrom
      })
      item.cityName = city.name;
    }

    res.render("admin/pages/order-edit", {
      pageTitle: `Order: ${orderDetail.code}`,
      orderDetail: orderDetail,
      paymentMethodList: paymentMethodList,
      paymentStatusList: paymentStatusList,
      statusList: statusList
    });
  } catch (error) {
    res.redirect(`/${pathAdmin}/order/list`);
  }
}

module.exports.editPatch = async (req, res) => {
  try {
    await Order.updateOne({
      _id: req.params.id,
      deleted: false
    }, req.body)

    res.json({
      code: "success",
      message: "Update order successfully!"
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
      case "delete":
        await Order.updateMany({
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
        await Order.updateMany({
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
        await Order.deleteMany({
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

    await Order.updateOne({
      _id: id
    }, {
      deleted: true,
      deletedAt: Date.now()
    });
    
    res.json({
      code: "success",
      message: "Delete order successfully!"
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
  const totalRecord = await Order.countDocuments(find);
  const totalPage = Math.ceil(totalRecord/limitItems);
  const pagination = {
    skip: skip,
    totalRecord: totalRecord,
    totalPage: totalPage
  };
  // End Pagination

  const orderList = await Order
    .find(find)
    .sort({
      deletedAt: "desc"
    })
    .limit(limitItems)
    .skip(skip)

  for (const orderDetail of orderList) {
    orderDetail.paymentMethodName = paymentMethodList.find(item => item.value == orderDetail.paymentMethod).label;
    orderDetail.paymentStatusName = paymentStatusList.find(item => item.value == orderDetail.paymentStatus).label;
    orderDetail.statusInfo = statusList.find(item => item.value == orderDetail.status);
    orderDetail.createdAtTime = moment(orderDetail.createdAt).format("HH:mm");
    orderDetail.createdAtDate = moment(orderDetail.createdAt).format("DD/MM/YYYY");
    orderDetail.deletedAtFormat = moment(orderDetail.deletedAt).format("HH:mm - DD/MM/YYYY");
  }

  // Add current count and page to pagination
  pagination.currentCount = orderList.length;
  pagination.currentPage = page;

  res.render("admin/pages/order-trash", {
    pageTitle: "Order Trash",
    orderList: orderList,
    pagination: pagination
  });
}

module.exports.undoPatch = async (req, res) => {
  try {
    const id = req.params.id;

    await Order.updateOne({
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

    await Order.deleteOne({
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