const User = require("../models/user.model");
const { throwError } = require("../utils/error.util");

// CreateUser
const createUser = async (user) => {
  try {
    const newUser = await User.create(user);

    if (newUser) {
      return {
        status: "SUCCESS",
        data: newUser,
      };
    } else {
      return {
        status: "FAILED",
        error: {
          statusCode: 422,
          identifier: "0x000B00",
          message: "Failed to create User",
        },
      };
    }
  } catch (error) {
    throwError("FAILED", 422, error.message, "0x000B01");
  }
};

// CountUsers
const countUsers = async (filter) => {
  try {
    const count = await User.countDocuments(filter);

    return {
      status: "SUCCESS",
      data: count,
    };
  } catch (error) {
    throwError("FAILED", 422, error.message, "0x000B10");
  }
};

// GetUsers
const getUsers = async (filter, projection, page, limit) => {
  try {
    const users = await User.find(filter, projection, {
      skip: (page - 1) * limit,
      limit: limit,
    });

    if (users && users.length) {
      return {
        status: "SUCCESS",
        data: users,
      };
    } else {
      return {
        status: "FAILED",
        error: {
          statusCode: 404,
          identifier: "0x000B02",
          message: "Users not found",
        },
      };
    }
  } catch (error) {
    throwError("FAILED", 422, error.message, "0x000B03");
  }
};

// GetUserById
const getUserById = async (userId, projection) => {
  try {
    const user = await User.findOne(
      { _id: userId, isDeleted: false },
      projection
    );

    if (user) {
      return {
        status: "SUCCESS",
        data: user,
      };
    } else {
      return {
        status: "FAILED",
        error: {
          statusCode: 404,
          identifier: "0x000B04",
          message: "User not found",
        },
      };
    }
  } catch (error) {
    throwError("FAILED", 422, error.message, "0x000B05");
  }
};

// GetUserByUsername
const getUserByUsername = async (username, projection) => {
  try {
    const user = await User.findOne({ username, isDeleted: false }, projection);

    if (user) {
      return {
        status: "SUCCESS",
        data: user,
      };
    } else {
      return {
        status: "FAILED",
        error: {
          statusCode: 404,
          identifier: "0x000B06",
          message: "User not found",
        },
      };
    }
  } catch (error) {
    throwError("FAILED", 422, error.message, "0x000B07");
  }
};

// GetUserByEmail
const getUserByEmail = async (email, projection) => {
  try {
    const user = await User.findOne({ email, isDeleted: false }, projection);

    if (user) {
      return {
        status: "SUCCESS",
        data: user,
      };
    } else {
      return {
        status: "FAILED",
        error: {
          statusCode: 404,
          identifier: "0x000B08",
          message: "User not found",
        },
      };
    }
  } catch (error) {
    throwError("FAILED", 422, error.message, "0x000B09");
  }
};

// UpdateUserById
const updateUserById = async (userId, update, options = {}) => {
  try {
    const updatedUser = await User.findOneAndUpdate(
      { _id: userId, isDeleted: false },
      update,
      options
    );

    if (updatedUser) {
      return {
        status: "SUCCESS",
        data: updatedUser,
      };
    } else {
      return {
        status: "FAILED",
        error: {
          statusCode: 404,
          identifier: "0x000B0A",
          message: "User not found",
        },
      };
    }
  } catch (error) {
    throwError("FAILED", 422, error.message, "0x000B0B");
  }
};

// DeleteUserById
const deleteUserById = async (userId, options = {}) => {
  try {
    const user = await User.findOneAndUpdate(
      { _id: userId, isDeleted: false },
      {
        $set: { isDeleted: true },
      },
      options
    );

    if (user.isDeleted) {
      return {
        status: "SUCCESS",
      };
    } else {
      return {
        status: "FAILED",
        error: {
          statusCode: 404,
          identifier: "0x000B0C",
          message: "User not found",
        },
      };
    }
  } catch (error) {
    throwError("FAILED", 422, error.message, "0x000B0D");
  }
};

// CheckUsernameAndEmailAvailability
const checkUsernameAndEmailAvailability = async (username, email) => {
  try {
    let user;

    if (username && email) {
      user = await User.findOne({
        $or: [{ username }, { email }],
        isDeleted: false,
      });
    } else {
      const query = { isDeleted: false };
      if (username) query.username = username;
      if (email) query.email = email;
      user = await User.findOne(query);
    }

    if (user) {
      let duplicateFields = [];

      if (user.username === username) {
        duplicateFields.push("Username");
      }

      if (user.email === email) {
        duplicateFields.push("Email");
      }

      return {
        status: "FAILED",
        error: {
          statusCode: 409,
          identifier: "0x000B0E",
          message: `${duplicateFields.join(" and ")} already exists`,
        },
      };
    } else {
      return {
        status: "SUCCESS",
        message: "Username and email are available",
      };
    }
  } catch (error) {
    throwError("FAILED", 422, error.message, "0x000B0F");
  }
};

module.exports = {
  createUser,
  countUsers,
  getUsers,
  getUserById,
  getUserByUsername,
  getUserByEmail,
  updateUserById,
  deleteUserById,
  checkUsernameAndEmailAvailability,
};
