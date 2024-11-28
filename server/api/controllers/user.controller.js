const bcrypt = require("bcrypt");
const User = require("../services/user.service");
const { throwError } = require("../utils/error.util");
const { imageCleanup } = require("../utils/imageCleanup.util");

/**
 * @desc    Get user profile
 * @route   GET /api/users/profile
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
 * @route   PATCH /api/users/profile
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
 * @route   POST /api/users
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
 * @route   GET /api/users
 * @access  Private/Admin
 */
const getUsers = async (req, res, next) => {
  try {
    const { page = 1, limit = 20, ...restQuery } = req.query;
    const filter = { isDeleted: false, role: "USER", ...restQuery };
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
 * @route   GET /api/users/:id
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
 * @route   PATCH /api/users/:id
 * @access  Private/Admin
 */
const updateUser = async (req, res, next) => {
  try {
    const userId = req.params.id;

    const user = await User.getUserById(userId, {
      email: 1,
      username: 1,
      avatar: 1,
    });

    if (user.status === "FAILED") {
      throwError(
        user.status,
        user.error.statusCode,
        user.error.message,
        user.error.identifier
      );
    }

    if (
      req.body.email !== user.data.email ||
      req.body.username !== user.data.username
    ) {
      const emailExists = await User.checkUsernameAndEmailAvailability(
        req.body.username !== user.data.username ? req.body.username : null,
        req.body.email !== user.data.email ? req.body.email : null
      );

      if (emailExists.status === "FAILED") {
        throwError(
          emailExists.status,
          emailExists.error.statusCode,
          emailExists.error.message,
          emailExists.error.identifier
        );
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
 * @route   DELETE /api/users/:id
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
  getUserProfile,
  updateUserProfile,
  createUser,
  getUsers,
  getUser,
  updateUser,
  deleteUser,
};
