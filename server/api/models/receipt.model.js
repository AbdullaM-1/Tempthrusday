const mongoose = require("mongoose");

const receiptSchema = new mongoose.Schema({
  emailId: String,
  senderName: String,
  amount: Number,
  date: Date,
  confirmation: String,
  memo: { type: String, default: null },
});

const ReceiptSchema = mongoose.model("Receipt", receiptSchema);

module.exports = ReceiptSchema;
