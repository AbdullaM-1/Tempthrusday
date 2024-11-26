const Receipt = require("../services/receipt.service");
const { throwError } = require("../utils/error.util");

/**
 * @desc    Get all receipts
 * @route   GET /api/receipts
 * @access  Private
 */
const getReceipts = async (req, res, next) => {
  try {
    const { page = 1, limit = 20, ...restQuery } = req.query;
    const filter = { isDeleted: false, ...restQuery };
    const projection = { emailId: 0, isDeleted: 0 };
    const count = await Receipt.countReceipts(filter);
    const receipts = await Receipt.getReceipts(filter, projection, page, limit);

    if (receipts.status === "FAILED") {
      throwError(
        receipts.status,
        receipts.error.statusCode,
        receipts.error.message,
        receipts.error.identifier
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
      data: receipts.data,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get single receipt
 * @route   GET /api/receipts/:id
 * @access  Private
 */
const getReceipt = async (req, res, next) => {
  try {
    const receiptId = req.params.id;

    const filter = { _id: receiptId, isDeleted: false };
    const projection = { emailId: 0, isDeleted: 0 };
    const receipt = await Receipt.getReceipt(filter, projection);

    if (receipt.status === "FAILED") {
      throwError(
        receipt.status,
        receipt.error.statusCode,
        receipt.error.message,
        receipt.error.identifier
      );
    }

    res.status(200).json({
      status: "SUCCESS",
      data: receipt.data,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update receipt
 * @route   PATCH /api/receipts/:id
 * @access  Private
 */
const updateReceipt = async (req, res, next) => {
  try {
    const receiptId = req.params.id;

    const filter = { _id: receiptId, isDeleted: false };
    const options = { fields: { emailId: 0, isDeleted: 0 } };
    const receipt = await Receipt.updateReceipt(filter, req.body, options);

    if (receipt.status === "FAILED") {
      throwError(
        receipt.status,
        receipt.error.statusCode,
        receipt.error.message,
        receipt.error.identifier
      );
    }

    res.status(200).json({
      status: "SUCCESS",
      data: receipt.data,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Delete receipt
 * @route   DELETE /api/receipts/:id
 * @access  Private
 */
const deleteReceipt = async (req, res, next) => {
  try {
    const receiptId = req.params.id;

    const filter = { _id: receiptId, isDeleted: false };
    const options = { new: true };
    const receipt = await Receipt.deleteReceipt(filter, options);

    if (receipt.status === "FAILED") {
      throwError(
        receipt.status,
        receipt.error.statusCode,
        receipt.error.message,
        receipt.error.identifier
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
  getReceipts,
  getReceipt,
  updateReceipt,
  deleteReceipt,
};
