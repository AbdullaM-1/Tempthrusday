const express = require("express");
const router = express.Router();

// Import your route handlers
const authRoutes = require("./auth.route");
const userRoutes = require("./user.route");
const receiptRoutes = require("./receipt.route");

// Mount the route handlers
router.use("/auth", authRoutes);
router.use("/users", userRoutes);
router.use("/receipts", receiptRoutes);

module.exports = router;
