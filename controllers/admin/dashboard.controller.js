const AccountAdmin = require("../../models/account-admin.model");
const Order = require("../../models/order.model");
const Tour = require("../../models/tour.model");
const Category = require("../../models/category.model");
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
  
  // Only count revenue from paid orders
  const paidOrders = orderList.filter(order => order.paymentStatus === "paid");
  overview.totalRevenue = paidOrders.reduce((total, item) => total + item.total, 0);
  // End Overview

  // Category Breakdown: resolve each order item's tour to its category
  const tourIds = [...new Set(orderList.flatMap(order => order.items.map(item => item.tourId)).filter(Boolean))];
  const tourList = await Tour.find({ _id: { $in: tourIds } }, { category: 1 });
  const tourCategoryMap = {};
  for (const tour of tourList) {
    tourCategoryMap[tour.id] = tour.category || "";
  }

  const categoryList = await Category.find({}, { name: 1 });
  const categoryNameMap = {};
  for (const category of categoryList) {
    categoryNameMap[category.id] = category.name;
  }

  const categoryBreakdownMap = new Map();
  const getCategoryBucket = (categoryId) => {
    const key = categoryId || "uncategorized";
    if (!categoryBreakdownMap.has(key)) {
      categoryBreakdownMap.set(key, {
        categoryName: categoryNameMap[categoryId] || "Uncategorized",
        totalBookings: 0,
        totalRevenue: 0
      });
    }
    return categoryBreakdownMap.get(key);
  };

  // Bookings: every tour line item across all non-deleted orders
  for (const order of orderList) {
    for (const item of order.items) {
      getCategoryBucket(tourCategoryMap[item.tourId]).totalBookings += 1;
    }
  }

  // Revenue: only from paid orders
  for (const order of paidOrders) {
    for (const item of order.items) {
      const itemRevenue = (item.quantityAdult || 0) * (item.priceNewAdult || 0)
        + (item.quantityChildren || 0) * (item.priceNewChildren || 0)
        + (item.quantityBaby || 0) * (item.priceNewBaby || 0);
      getCategoryBucket(tourCategoryMap[item.tourId]).totalRevenue += itemRevenue;
    }
  }

  const categoryBreakdown = Array.from(categoryBreakdownMap.values())
    .sort((a, b) => b.totalRevenue - a.totalRevenue);
  // End Category Breakdown

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
    recentOrders: recentOrders,
    categoryBreakdown: categoryBreakdown
  });
}

module.exports.revenueChartPost = async (req, res) => {
  const { currentMonth, currentYear, prevMonth, prevYear, arrayDay } = req.body;

  // Query all orders in the current month
  const orderListCurrentMonth = await Order
    .find({
      deleted: false,
      paymentStatus: "paid",
      createdAt: {
        $gte: new Date(currentYear, currentMonth - 1, 1),
        $lt: new Date(currentYear, currentMonth, 1),
      }
    })

  // Query all orders in the previous month
  const orderListPrevMonth = await Order
    .find({
      deleted: false,
      paymentStatus: "paid",
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