const Confirmation = require("../models/confirmation.model");
const { throwError } = require("../utils/error.util");

// CreateConfirmation
const createConfirmation = async (confirmation) => {
  try {
    const newConfirmation = await Confirmation.create(confirmation);

    if (newConfirmation) {
      return {
        status: "SUCCESS",
        data: newConfirmation,
      };
    } else {
      return {
        status: "FAILED",
        error: {
          statusCode: 422,
          identifier: "0x000C00",
          message: "Failed to create Confirmation",
        },
      };
    }
  } catch (error) {
    throwError("FAILED", 422, error.message, "0x000C01");
  }
};

// CountConfirmations
const countConfirmations = async (filter) => {
  try {
    const count = await Confirmation.countDocuments(filter);

    return {
      status: "SUCCESS",
      data: count,
    };
  } catch (error) {
    throwError("FAILED", 422, error.message, "0x000C0A");
  }
};

// GetConfirmations
const getConfirmations = async (
  filter,
  projection,
  page,
  limit,
  options = {}
) => {
  try {
    const confirmations = await Confirmation.find(filter, projection, {
      ...options,
      skip: (page - 1) * limit,
      limit: limit,
    });

    if (confirmations && confirmations.length) {
      return {
        status: "SUCCESS",
        data: confirmations,
      };
    } else {
      return {
        status: "FAILED",
        error: {
          statusCode: 404,
          identifier: "0x000C02",
          message: "No Confirmations found",
        },
      };
    }
  } catch (error) {
    throwError("FAILED", 422, error.message, "0x000C03");
  }
};

// GetConfirmation
const getConfirmation = async (filter, projection, options = {}) => {
  try {
    const confirmation = await Confirmation.findOne(
      filter,
      projection,
      options
    );

    if (confirmation) {
      return {
        status: "SUCCESS",
        data: confirmation,
      };
    } else {
      return {
        status: "FAILED",
        error: {
          statusCode: 404,
          identifier: "0x000C04",
          message: "Confirmation not found",
        },
      };
    }
  } catch (error) {
    throwError("FAILED", 422, error.message, "0x000C05");
  }
};

// UpdateConfirmation
const updateConfirmation = async (filter, update, options = {}) => {
  try {
    const updatedConfirmation = await Confirmation.findOneAndUpdate(
      filter,
      update,
      {
        new: true,
        ...options,
      }
    );

    if (updatedConfirmation) {
      return {
        status: "SUCCESS",
        data: updatedConfirmation,
      };
    } else {
      return {
        status: "FAILED",
        error: {
          statusCode: 404,
          identifier: "0x000C06",
          message: "Confirmation not found",
        },
      };
    }
  } catch (error) {
    throwError("FAILED", 422, error.message, "0x000C07");
  }
};

// DeleteConfirmation
const deleteConfirmation = async (filter, options = {}) => {
  try {
    const confirmation = await Confirmation({
      ...filter,
      isDeleted: false,
    }).findOneAndUpdate({ $set: { isDeleted: true } }, options);

    if (confirmation) {
      return {
        status: "SUCCESS",
        data: confirmation,
      };
    } else {
      return {
        status: "FAILED",
        error: {
          statusCode: 404,
          identifier: "0x000C08",
          message: "Confirmation not found",
        },
      };
    }
  } catch (error) {
    throwError("FAILED", 422, error.message, "0x000C09");
  }
};

module.exports = {
  createConfirmation,
  countConfirmations,
  getConfirmations,
  getConfirmation,
  updateConfirmation,
  deleteConfirmation,
};
