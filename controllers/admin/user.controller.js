const Order = require("../../models/order.model");
const moment = require('moment');
const { paginationLimit } = require("../../config/variable.config");

module.exports.list = async (req, res) => {
  try {
    const find = {
      deleted: false
    };

    // Filter by Date Range
    if(req.query.startDate || req.query.endDate) {
      const filterDate = {};
      if(req.query.startDate) {
        const startDate = moment(req.query.startDate, "YYYY-MM-DD").startOf('day').toDate();
        filterDate.$gte = startDate;
      }
      if(req.query.endDate) {
        const endDate = moment(req.query.endDate, "YYYY-MM-DD").endOf('day').toDate();
        filterDate.$lte = endDate;
      }
      find.createdAt = filterDate;
    }
    // End Filter by Date Range

    // Get all orders with filters
    const orders = await Order.find(find);

    // Group by phone to get unique customers
    const customerMap = new Map();

    for (const order of orders) {
      const key = order.phone; // Use phone as unique identifier
      
      if (!customerMap.has(key)) {
        customerMap.set(key, {
          fullName: order.fullName,
          phone: order.phone,
          email: order.email || "",
          totalOrders: 0,
          totalSpent: 0,
          lastOrderDate: order.createdAt
        });
      }

      const customer = customerMap.get(key);
      customer.totalOrders += 1;
      customer.totalSpent += order.total;
      
      // Update last order date if this order is more recent
      if (order.createdAt > customer.lastOrderDate) {
        customer.lastOrderDate = order.createdAt;
      }
    }

    // Convert Map to Array
    let customerList = Array.from(customerMap.values());

    // Search by keyword (name, phone, email)
    if(req.query.keyword) {
      const keyword = req.query.keyword.toLowerCase();
      customerList = customerList.filter(customer => {
        return customer.fullName.toLowerCase().includes(keyword) ||
               customer.phone.includes(keyword) ||
               (customer.email && customer.email.toLowerCase().includes(keyword));
      });
    }
    // End Search

    // Sort by total spent (descending) by default
    customerList.sort((a, b) => b.totalSpent - a.totalSpent);

    // Pagination
    const limitItems = paginationLimit.limitItemsAdmin;
    let page = 1;
    if(req.query.page && parseInt(req.query.page) > 0) {
      page = parseInt(req.query.page);
    }
    const skip = (page - 1) * limitItems;
    const totalRecord = customerList.length;
    const totalPage = Math.ceil(totalRecord / limitItems);

    const paginatedCustomers = customerList.slice(skip, skip + limitItems);

    // Format dates
    for (const customer of paginatedCustomers) {
      customer.lastOrderDateFormat = moment(customer.lastOrderDate).format("HH:mm - DD/MM/YYYY");
    }

    const pagination = {
      skip: skip,
      totalRecord: totalRecord,
      totalPage: totalPage,
      currentCount: paginatedCustomers.length,
      currentPage: page
    };

    res.render("admin/pages/user-list", {
      pageTitle: "Client Management",
      customerList: paginatedCustomers,
      pagination: pagination
    });
  } catch (error) {
    console.log(error);
    res.redirect(`/${req.app.locals.pathAdmin}/dashboard`);
  }
}