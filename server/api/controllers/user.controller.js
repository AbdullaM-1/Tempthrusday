const { google } = require("googleapis");
const bcrypt = require("bcrypt");
const User = require("../services/user.service");
const UserToken = require("../models/usertoken.model");
const Gmail = require("../services/gmail.service");
const { throwError } = require("../utils/error.util");
const { isEmailOrUsername } = require("../utils/isEmailOrUsername.util");
const { generateToken } = require("../utils/jwt.util");
const { imageCleanup } = require("../utils/imageCleanup.util");

/**
 * @desc    Register a new user
 * @route   POST /api/auth/register
 * @access  Public
 */
const registerUser = async (req, res, next) => {
  try {
    const { username, email } = req.body;

    const userExists = await User.checkUsernameAndEmailAvailability(
      username,
      email
    );

    if (userExists.status === "FAILED") {
      throwError(
        userExists.status,
        userExists.error.statusCode,
        userExists.error.message,
        userExists.error.identifier
      );
    }

    const newUser = await User.createUser(req.body);

    if (newUser.status === "FAILED") {
      throwError(
        newUser.status,
        newUser.error.statusCode,
        newUser.error.message,
        newUser.error.identifier
      );
    }

    const signedToken = await generateToken(newUser.data._id, "USER");

    // Soft delete properties
    newUser.data.password = undefined;
    newUser.data.isDeleted = undefined;

    res.status(201).json({
      status: "SUCCESS",
      data: newUser.data,
      token: signedToken,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Login user
 * @route   POST /api/auth/login
 * @access  Public
 */
const loginUser = async (req, res, next) => {
  try {
    const { emailOrUsername, password } = req.body;

    const isEmailOrUsernameProvided = isEmailOrUsername(emailOrUsername);

    let userExists;
    const projection = { password: 1, role: 1 };
    if (isEmailOrUsernameProvided === "email") {
      userExists = await User.getUserByEmail(emailOrUsername, projection);
    } else {
      userExists = await User.getUserByUsername(emailOrUsername, projection);
    }

    if (userExists.status === "FAILED") {
      throwError(
        userExists.status,
        401,
        "Incorrect Credentials",
        userExists.error.identifier
      );
    }

    const isPasswordCorrect = await bcrypt.compare(
      password,
      userExists.data.password
    );

    if (!isPasswordCorrect) {
      throwError("FAILED", 401, "Incorrect Credentials", "0x001000");
    }

    const signedToken = await generateToken(
      userExists.data._id,
      userExists.data.role
    );

    const user = await User.getUserById(userExists.data._id, {
      password: 0,
      isDeleted: 0,
    });

    res.status(200).json({
      status: "SUCCESS",
      data: user.data,
      tokens: { accessToken: signedToken },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Google OAuth2
 * @route   GET /api/auth/google
 * @access  Public
 * @note    Redirects to Google OAuth2 consent screen
 * @note    Redirect URI: /api/user/google/callback
 */
const googleAuth = (req, res) => {
  const SCOPES = ["https://www.googleapis.com/auth/gmail.readonly"];

  console.log(process.env.REDIRECT_URI);

  const authUrl = Gmail.oauth2Client.generateAuthUrl({
    access_type: "offline",
    scope: SCOPES,
  });
  res.redirect(authUrl);
};

/**
 * @desc    Google OAuth2 Callback
 * @route   GET /api/auth/google/callback
 * @access  Public
 * @note    Callback URI for Google OAuth2
 * @note    Closes the tab after successful authorization
 */
const googleAuthCallback = async (req, res) => {
  const { code } = req.query;

  const { tokens } = await Gmail.oauth2Client.getToken(code);

  console.log("Tokens:", tokens);

  // Store the refresh token in the database
  if (tokens.refresh_token) {
    await Gmail.create({
      email: process.env.CLIENT_EMAIL,
      accessToken: tokens.access_token,
      refreshToken: tokens.refresh_token,
      expiryDate: tokens.expiry_date,
    });
  }

  // Start Polling
  await Gmail.startPolling();

  res.redirect("http://localhost:5173");
};

/**
 * @desc    Get user profile
 * @route   GET /api/user/profile
 * @access  Private/User
 */
const getUserProfile = async (req, res, next) => {
  try {
    const userId = req.user._id;

    const projection = { password: 0, isDeleted: 0 };
    const user = await User.getUserById(userId, projection);

    if (user.status === "FAILED") {
      throwError(
        user.status,
        user.error.statusCode,
        user.error.message,
        user.error.identifier
      );
    }

    res.status(200).json({
      status: "SUCCESS",
      data: user.data,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update user profile
 * @route   PATCH /api/user/profile
 * @access  Private/User
 */
const updateUserProfile = async (req, res, next) => {
  try {
    const userId = req.user._id;

    const user = await User.getUserById(userId, { password: 1, avatar: 1 });

    if (user.status === "FAILED") {
      throwError(
        user.status,
        user.error.statusCode,
        user.error.message,
        user.error.identifier
      );
    }

    const isPasswordCorrect = await bcrypt.compare(
      req.body.oldPassword,
      user.data.password
    );

    if (!isPasswordCorrect) {
      throwError("FAILED", 401, "Incorrect Password", "0x001001");
    }

    const options = {
      new: true,
      fields: { password: 0, isDeleted: 0 },
    };
    const updatedUser = await User.updateUserById(userId, req.body, options);

    if (updatedUser.status === "FAILED") {
      throwError(
        updatedUser.status,
        updatedUser.error.statusCode,
        updatedUser.error.message,
        updatedUser.error.identifier
      );
    }

    if (updatedUser.data?.avatar !== user.data?.avatar) {
      // Delete old avatar
      imageCleanup(user.data.avatar);
    }

    res.status(200).json({
      status: "SUCCESS",
      data: updatedUser.data,
    });
  } catch (error) {
    next(error);
  }
};

// ---------------------------- ADMIN CONTROLLERS ----------------------------

/**
 * @desc    Create a new user
 * @route   POST /api/user
 * @access  Private/Admin
 */
const createUser = async (req, res, next) => {
  try {
    const { username, email } = req.body;

    const userExists = await User.checkUsernameAndEmailAvailability(
      username,
      email
    );

    if (userExists.status === "FAILED") {
      throwError(
        userExists.status,
        userExists.error.statusCode,
        userExists.error.message,
        userExists.error.identifier
      );
    }

    // Note: Default password will be same as username
    req.body.password = req.body.username;

    const newUser = await User.createUser(req.body);

    if (newUser.status === "FAILED") {
      throwError(
        newUser.status,
        newUser.error.statusCode,
        newUser.error.message,
        newUser.error.identifier
      );
    }

    // Soft delete properties
    newUser.data.password = undefined;
    newUser.data.isDeleted = undefined;

    res.status(201).json({
      status: "SUCCESS",
      data: newUser.data,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get all users
 * @route   GET /api/user
 * @access  Private/Admin
 */
const getUsers = async (req, res, next) => {
  try {
    const { page = 1, limit = 20, ...restQuery } = req.query;
    const filter = { isDeleted: false, ...restQuery };
    const projection = { password: 0, isDeleted: 0 };
    const count = await User.countUsers(filter);
    const users = await User.getUsers(filter, projection, page, limit);

    if (users.status === "FAILED") {
      throwError(
        users.status,
        users.error.statusCode,
        users.error.message,
        users.error.identifier
      );
    }

    res.status(200).json({
      status: "SUCCESS",
      meta: {
        hasNextPage: page < Math.ceil(count.data / limit),
        hasPreviousPage: page > 1,
        itemCount: count.data,
        page: page,
        pageCount: Math.ceil(count.data / limit),
        limit,
      },
      data: users.data,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get user profile
 * @route   GET /api/user/:id
 * @access  Private/Admin
 */
const getUser = async (req, res, next) => {
  try {
    const userId = req.params.id;

    const projection = { password: 0, isDeleted: 0 };
    const user = await User.getUserById(userId, projection);

    if (user.status === "FAILED") {
      throwError(
        user.status,
        user.error.statusCode,
        user.error.message,
        user.error.identifier
      );
    }

    res.status(200).json({
      status: "SUCCESS",
      data: user.data,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update user
 * @route   PATCH /api/user/:id
 * @access  Private/Admin
 */
const updateUser = async (req, res, next) => {
  try {
    const userId = req.params.id;

    const user = await User.getUserById(userId, { password: 1, avatar: 1 });
    if (req.body.password) {
      if (user.status === "FAILED") {
        throwError(
          user.status,
          user.error.statusCode,
          user.error.message,
          user.error.identifier
        );
      }

      const isPasswordCorrect = await bcrypt.compare(
        req.body.oldPassword,
        user.data.password
      );

      if (!isPasswordCorrect) {
        throwError("FAILED", 401, "Incorrect Credentials", "0x001001");
      }
    }

    const options = {
      new: true,
      fields: { password: 0, isDeleted: 0 },
    };
    const updatedUser = await User.updateUserById(userId, req.body, options);

    if (updatedUser.status === "FAILED") {
      throwError(
        updatedUser.status,
        updatedUser.error.statusCode,
        updatedUser.error.message,
        updatedUser.error.identifier
      );
    }

    if (updatedUser.data.avatar !== user.data?.avatar) {
      // Delete old avatar
      imageCleanup(user.data.avatar);
    }

    res.status(200).json({
      status: "SUCCESS",
      data: updatedUser.data,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Delete user profile
 * @route   DELETE /api/user/:id
 * @access  Private/Admin
 */
const deleteUser = async (req, res, next) => {
  try {
    const userId = req.params.id;

    const options = { new: true };
    const deletedUser = await User.deleteUserById(userId, options);

    if (deletedUser.status === "FAILED") {
      throwError(
        deletedUser.status,
        deletedUser.error.statusCode,
        deletedUser.error.message,
        deletedUser.error.identifier
      );
    }

    res.status(200).json({
      status: "SUCCESS",
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  registerUser,
  loginUser,
  googleAuth,
  googleAuthCallback,
  getUserProfile,
  updateUserProfile,
  createUser,
  getUsers,
  getUser,
  updateUser,
  deleteUser,
};
