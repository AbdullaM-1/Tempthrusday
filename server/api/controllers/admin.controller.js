const bcrypt = require("bcrypt");
const User = require("../services/user.service");
const { throwError } = require("../utils/error.util");
const { imageCleanup } = require("../utils/imageCleanup.util");

/**
 * @desc    Create a new user
 * @route   POST /api/user
 * @access  Public
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
    const countusers = await User.countUsers(filter);
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
      pagination: {
        total: countusers.data,
        returned: users.data.length,
        limit: parseInt(limit),
        page: parseInt(page),
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
 * @route   DELETE /api/user/profile
 * @access  Private/user
 */
const deleteUser = async (req, res, next) => {
  try {
    const userId = req.user._id;

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
  registerUser: createUser,
  getUsers,
  getUserProfile: getUser,
  updateUserProfile: updateUser,
  deleteUserProfile: deleteUser,
};
