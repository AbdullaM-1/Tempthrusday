const mongoose = require("mongoose");

const receiptSchema = new mongoose.Schema(
  {
    emailId: String,
    senderName: String,
    amount: Number,
    date: Date,
    confirmation: String,
    commission: { type: Number, default: 0 }, // percentage to calculate profit
    status: { type: String, default: "pending" },
    memo: { type: String, default: null },
    isDeleted: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);

receiptSchema.virtual("associatedRecipient", {
  ref: "Confirmation", // The model to use
  localField: "confirmation", // Find people where `localField`
  foreignField: "code", // is equal to `foreignField`
  justOne: true, // Optional, if you want a single document
  // options: { populate: { path: "user", select: "username name phone email" } },
});

receiptSchema.set("toObject", { virtuals: true });
receiptSchema.set("toJSON", { virtuals: true });

const ReceiptSchema = mongoose.model("Receipt", receiptSchema);

module.exports = ReceiptSchema;
