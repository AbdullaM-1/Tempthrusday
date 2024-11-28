const mongoose = require("mongoose");

const confirmationSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    code: { type: String, required: true },
    isDeleted: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);

confirmationSchema.virtual("associatedReceipt", {
  ref: "Receipt", // The model to use
  localField: "code", // Find people where `localField`
  foreignField: "confirmation", // is equal to `foreignField`
  justOne: true, // Optional, if you want a single document
});

confirmationSchema.set("toObject", { virtuals: true });
confirmationSchema.set("toJSON", { virtuals: true });

const Confirmation = mongoose.model("Confirmation", confirmationSchema);

module.exports = Confirmation;
