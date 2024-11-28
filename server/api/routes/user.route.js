const express = require("express");
const router = express.Router();

const Controller = require("../controllers/user.controller");
const validate = require("../middlewares/validateReq.middleware");
const UserValidation = require("../validators/user.validator");
const AdminValidation = require("../validators/admin.validator");
const authenticate = require("../middlewares/authenticate.middleware");
const Authorize = require("../middlewares/authorize.middlware");
const { uploadImage } = require("../middlewares/image.middleware");

// // Route for registering user
// router.post(
//   "/register",
//   uploadImage,
//   validate(Validation.registerSchema, "BODY"),
//   Controller.registerUser
// );

// // Route for logging in user
// router.post(
//   "/login",
//   validate(UserValidation.loginSchema, "BODY"),
//   Controller.loginUser
// );

// Route for getting user profile
router.get(
  "/profile",
  authenticate,
  Authorize.isUserOrAdmin,
  Controller.getUserProfile
);

// Route for updating user profile
router.patch(
  "/profile",
  authenticate,
  Authorize.isUserOrAdmin,
  uploadImage,
  validate(UserValidation.updateProfileSchema, "BODY"),
  Controller.updateUserProfile
);

// --------------------------------- ADMIN ROUTES ---------------------------------
// Route for creating new user
router.post(
  "/",
  authenticate,
  Authorize.isAdmin,
  validate(AdminValidation.createSchema, "BODY"),
  Controller.createUser
);

// Route for getting all users
router.get("/", authenticate, Authorize.isAdmin, Controller.getUsers);

// Route for getting user by id
router.get("/:id", authenticate, Authorize.isAdmin, Controller.getUser);

// Route for updating user by id
router.patch(
  "/:id",
  validate(AdminValidation.updateSchema, "BODY"),
  authenticate,
  Authorize.isAdmin,
  uploadImage,
  Controller.updateUser
);

// Route for deleting user by id
router.delete("/:id", authenticate, Authorize.isAdmin, Controller.deleteUser);

module.exports = router;
