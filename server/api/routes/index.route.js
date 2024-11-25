const express = require("express");
const router = express.Router();

// Import your route handlers
const authRoutes = require("./auth.route");
const userRoutes = require("./user.route");

// Mount the route handlers
router.use("/auth", authRoutes);
router.use("/users", userRoutes);

module.exports = router;
