const mongoose = require("mongoose");

const schema = new mongoose.Schema(
  {
    email: String,
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

const Contact = mongoose.model('Contact', schema, "contacts");

module.exports = Contact;