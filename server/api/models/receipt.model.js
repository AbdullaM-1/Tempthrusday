const mongoose = require("mongoose");

const receiptSchema = new mongoose.Schema(
  {
    emailId: String,
    senderName: String,
    amount: Number,
    date: Date,
    confirmation: String,
    memo: { type: String, default: null },
    isDeleted: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);

const ReceiptSchema = mongoose.model("Receipt", receiptSchema);

module.exports = ReceiptSchema;
