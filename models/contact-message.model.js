const mongoose = require("mongoose");

const schema = new mongoose.Schema(
  {
    fullName: String,
    email: String,
    phone: String,
    subject: String,
    message: String,
    deleted: {
      type: Boolean,
      default: false
    },
    deletedBy: String,
    deletedAt: Date
  },
  {
    timestamps: true
  }
);

const ContactMessage = mongoose.model('ContactMessage', schema, "contact_messages");

module.exports = ContactMessage;
