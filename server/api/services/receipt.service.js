const Receipt = require("../models/receipt.model");
const { throwError } = require("../utils/error.util");

// CreateReceipt
const createReceipt = async (receipt) => {
  try {
    const newReceipt = await Receipt.create(receipt);

    if (newReceipt) {
      return {
        status: "SUCCESS",
        data: newReceipt,
      };
    } else {
      return {
        status: "FAILED",
        error: {
          statusCode: 422,
          identifier: "0x000A00",
          message: "Failed to create Receipt",
        },
      };
    }
  } catch (error) {
    throwError("FAILED", 422, error.message, "0x000A01");
  }
};

// CountReceipts
const countReceipts = async (filter) => {
  try {
    const count = await Receipt.countDocuments(filter);

    return {
      status: "SUCCESS",
      data: count,
    };
  } catch (error) {
    throwError("FAILED", 422, error.message, "0x000A10");
  }
};

// GetReceipts
const getReceipts = async (filter, projection, page, limit) => {
  try {
    const receipts = await Receipt.find(filter, projection, {
      skip: (page - 1) * limit,
      limit: limit,
    });

    if (receipts && receipts.length) {
      return {
        status: "SUCCESS",
        data: receipts,
      };
    } else {
      return {
        status: "FAILED",
        error: {
          statusCode: 404,
          identifier: "0x000A02",
          message: "No Receipts found",
        },
      };
    }
  } catch (error) {
    throwError("FAILED", 422, error.message, "0x000A03");
  }
};

// GetReceipt
const getReceipt = async (filter, projection) => {
  try {
    const receipt = await Receipt.findOne(filter, projection);

    if (receipt) {
      return {
        status: "SUCCESS",
        data: receipt,
      };
    } else {
      return {
        status: "FAILED",
        error: {
          statusCode: 404,
          identifier: "0x000A04",
          message: "Receipt not found",
        },
      };
    }
  } catch (error) {
    throwError("FAILED", 422, error.message, "0x000A05");
  }
};

// UpdateReceipt
const updateReceipt = async (filter, update, options = {}) => {
  try {
    const updatedReceipt = await Receipt.findOneAndUpdate(filter, update, {
      new: true,
      ...options,
    });

    if (updatedReceipt) {
      return {
        status: "SUCCESS",
        data: updatedReceipt,
      };
    } else {
      return {
        status: "FAILED",
        error: {
          statusCode: 404,
          identifier: "0x000A06",
          message: "Receipt not found",
        },
      };
    }
  } catch (error) {
    throwError("FAILED", 422, error.message, "0x000A07");
  }
};

// DeleteReceipt
const deleteReceipt = async (filter, options = {}) => {
  try {
    const receipt = await Receipt({
      ...filter,
      isDeleted: false,
    }).findOneAndUpdate({ $set: { isDeleted: true } }, options);

    if (receipt) {
      return {
        status: "SUCCESS",
        data: receipt,
      };
    } else {
      return {
        status: "FAILED",
        error: {
          statusCode: 404,
          identifier: "0x000A08",
          message: "Receipt not found",
        },
      };
    }
  } catch (error) {
    throwError("FAILED", 422, error.message, "0x000A09");
  }
};

module.exports = {
  createReceipt,
  countReceipts,
  getReceipts,
  getReceipt,
  updateReceipt,
  deleteReceipt,
};
