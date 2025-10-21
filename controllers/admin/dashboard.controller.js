const AccountAdmin = require("../../models/account-admin.model");
const Order = require("../../models/order.model");
const moment = require("moment");
const { paginationLimit } = require("../../config/variable.config");

module.exports.dashboard = async (req, res) => {
  // Overview 
  const overview = {
    totalAdmin: 0,
    totalOrder: 0,
    totalRevenue: 0,
  };

  overview.totalAdmin = await AccountAdmin.countDocuments({
    deleted: false
  })

  const orderList = await Order.find({
    deleted: false
  })
  overview.totalOrder = orderList.length;
  overview.totalRevenue = orderList.reduce((total, item) => total + item.total, 0);
  // End Overview

  // Recent Orders
  const recentOrders = await Order
    .find({
      deleted: false
    })
    .sort({ createdAt: -1 })
    .limit(paginationLimit.limitRecentOrders);

  // Format date time for each order
  for(const order of recentOrders) {
    order.createdAtTime = moment(order.createdAt).format("HH:mm");
    order.createdAtDate = moment(order.createdAt).format("DD/MM/YYYY");
  }
  // End Recent Orders

  res.render("admin/pages/dashboard", {
    pageTitle: "Overview",
    overview: overview,
    recentOrders: recentOrders
  });
}

module.exports.revenueChartPost = async (req, res) => {
  const { currentMonth, currentYear, prevMonth, prevYear, arrayDay } = req.body;

  // Query all orders in the current month
  const orderListCurrentMonth = await Order
    .find({
      deleted: false,
      createdAt: {
        $gte: new Date(currentYear, currentMonth - 1, 1),
        $lt: new Date(currentYear, currentMonth, 1),
      }
    })

  // Query all orders in the previous month
  const orderListPrevMonth = await Order
    .find({
      deleted: false,
      createdAt: {
        $gte: new Date(prevYear, prevMonth - 1, 1),
        $lt: new Date(prevYear, prevMonth, 1),
      }
    })

  // Create revenue array for each day
  const dataCurrentMonth = [];
  const dataPrevMonth = [];

  for (const day of arrayDay) {
    // Calculate daily revenue for the current month
    let revenueCurrent = 0;
    for (const order of orderListCurrentMonth) {
      const orderDay = new Date(order.createdAt).getDate();
      if(day == orderDay) {
        revenueCurrent += order.total;
      }
    }
    dataCurrentMonth.push(revenueCurrent);

    // Calculate daily revenue for the previous month
    let revenuePrev = 0;
    for (const order of orderListPrevMonth) {
      const orderDay = new Date(order.createdAt).getDate();
      if(day == orderDay) {
        revenuePrev += order.total;
      }
    }
    dataPrevMonth.push(revenuePrev);
  }

  res.json({
    code: "success",
    message: "Success!",
    dataCurrentMonth: dataCurrentMonth,
    dataPrevMonth: dataPrevMonth
  })
}