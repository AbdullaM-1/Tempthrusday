const express = require("express");
const router = express.Router();

const Controller = require("../controllers/auth.controller");
const validate = require("../middlewares/validateReq.middleware");
const UserValidation = require("../validators/user.validator");
const authenticate = require("../middlewares/authenticate.middleware");
const Authorize = require("../middlewares/authorize.middlware");
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

router.get(
  "/google/status",
  authenticate,
  Authorize.isAdmin,
  Controller.googleAuthStatus
);

// Route for logging in user
router.post(
  "/login",
  validate(UserValidation.loginSchema, "BODY"),
  Controller.loginUser
);

module.exports = router;
