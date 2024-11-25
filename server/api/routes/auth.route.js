const express = require("express");
const router = express.Router();

const Controller = require("../controllers/auth.controller");
const validate = require("../middlewares/validateReq.middleware");
const UserValidation = require("../validators/user.validator");
const UserToken = require("../models/usertoken.model");
// const { uploadImage } = require("../middlewares/image.middleware");

// // Route for registering user
// router.post(
//   "/register",
//   uploadImage,
//   validate(UserValidation.registerSchema, "BODY"),
//   Controller.registerUser
// );

router.get("/google", Controller.googleAuth);

router.get("/google/callback", Controller.googleAuthCallback);

router.get("/google/status", async (req, res) => {
  const userToken = await UserToken.findOne({
    email: process.env.CLIENT_EMAIL,
  });
  res.json({ isConnected: !!userToken });
});

// Route for logging in user
router.post(
  "/login",
  validate(UserValidation.loginSchema, "BODY"),
  Controller.loginUser
);

module.exports = router;
