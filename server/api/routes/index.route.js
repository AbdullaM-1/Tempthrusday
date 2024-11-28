const express = require("express");
const router = express.Router();

// Import your route handlers
const authRoutes = require("./auth.route");
const userRoutes = require("./user.route");
const receiptRoutes = require("./receipt.route");
const confirmationRoutes = require("./confirmation.route");

// Mount the route handlers
router.use("/auth", authRoutes);
router.use("/users", userRoutes);
router.use("/receipts", receiptRoutes);
router.use("/confirmations", confirmationRoutes);

module.exports = router;
