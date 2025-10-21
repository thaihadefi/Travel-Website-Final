const mongoose = require("mongoose");

const schema = new mongoose.Schema(
  {
    code: String,
    fullName: String,
    phone: String,
    note: String,
    items: Array,
    subTotal: Number,
    discount: Number,
    total: Number,
    paymentMethod: String, // bank, money, vnpay, zalopay
    paymentStatus: String, // unpaid, paid
    status: String, // initial, done, cancel
    updatedBy: String,
    deleted: {
      type: Boolean,
      default: false
    },
    deletedBy: String,
    deletedAt: Date
  },
  {
    timestamps: true, // Automatically generate createdAt and updatedAt fields
  }
);

const Order = mongoose.model('Order', schema, "orders");

module.exports = Order;