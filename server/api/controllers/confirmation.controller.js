const Confirmation = require("../services/confirmation.service");
const { throwError } = require("../utils/error.util");

/**
 * @desc    Create confirmation
 * @route   POST /api/confirmations
 * @access  Private/User
 */
const createConfirmation = async (req, res, next) => {
  try {
    const userId = req.user._id;
    req.body.user = userId;

    const { code } = req.body;
    const filter = { code, isDeleted: false };
    const projection = { _id: 1 };

    const existingConfirmation = await Confirmation.getConfirmation(
      filter,
      projection
    );

    if (existingConfirmation.status === "SUCCESS") {
      throwError(
        "FAILED",
        409,
        "Confirmation already exists with the provided code",
        "0x000C81"
      );
    }

    const confirmation = await Confirmation.createConfirmation(req.body);

    if (confirmation.status === "FAILED") {
      throwError(
        confirmation.status,
        confirmation.error.statusCode,
        confirmation.error.message,
        confirmation.error.identifier
      );
    }

    res.status(201).json({
      status: "SUCCESS",
      data: confirmation.data,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get all confirmations
 * @route   GET /api/confirmations
 * @access  Private
 */
const getConfirmations = async (req, res, next) => {
  try {
    const { page = 1, limit = 20, ...restQuery } = req.query;
    const filter = { isDeleted: false, ...restQuery };
    if (req.user.role === "USER") filter.user = req.user._id;
    const projection = { isDeleted: 0 };
    const options = {
      populate: [
        { path: "user", select: "username name email phone" },
        { path: "associatedReceipt", select: "_id -confirmation" },
      ],
    };

    // if (req.user.role === "USER") {
    //   filter.user = req.user._id;
    //   Object.assign(projection, { user: 0 });
    // }
    // const options = {
    //   populate: [{ path: "associatedReceipt", select: "_id -confirmation" }],
    // };
    // if (req.user.role === "ADMIN") {
    //   options.populate.push({
    //     path: "user",
    //     select: "username name email phone",
    //   });
    // }

    const count = await Confirmation.countConfirmations(filter);
    const confirmations = await Confirmation.getConfirmations(
      filter,
      projection,
      page,
      limit,
      options
    );

    if (confirmations.status === "FAILED") {
      throwError(
        confirmations.status,
        confirmations.error.statusCode,
        confirmations.error.message,
        confirmations.error.identifier
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
      data: confirmations.data,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get single confirmation
 * @route   GET /api/confirmations/:id
 * @access  Private
 */
const getConfirmation = async (req, res, next) => {
  try {
    const confirmationId = req.params.id;

    const filter = { _id: confirmationId, isDeleted: false };
    if (req.user.role === "USER") filter.user = req.user._id;
    const projection = { isDeleted: 0, user: { phone: 0, name: 0 } };
    const options = {
      populate: [
        { path: "user", select: "username name email phone" },
        { path: "associatedReceipt", select: "_id -confirmation" },
      ],
    };
    const confirmation = await Confirmation.getConfirmation(
      filter,
      projection,
      options
    );

    if (confirmation.status === "FAILED") {
      throwError(
        confirmation.status,
        confirmation.error.statusCode,
        confirmation.error.message,
        confirmation.error.identifier
      );
    }

    res.status(200).json({
      status: "SUCCESS",
      data: confirmation.data,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update confirmation
 * @route   PATCH /api/confirmations/:id
 * @access  Private/User
 */
const updateConfirmation = async (req, res, next) => {
  try {
    const confirmationId = req.params.id;

    const filter = { _id: confirmationId, isDeleted: false };
    const options = { fields: { isDeleted: 0 } };
    const confirmation = await Confirmation.updateConfirmation(
      filter,
      req.body,
      options
    );

    if (confirmation.status === "FAILED") {
      throwError(
        confirmation.status,
        confirmation.error.statusCode,
        confirmation.error.message,
        confirmation.error.identifier
      );
    }

    res.status(200).json({
      status: "SUCCESS",
      data: confirmation.data,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Delete confirmation
 * @route   DELETE /api/confirmations/:id
 * @access  Private/User
 */
const deleteConfirmation = async (req, res, next) => {
  try {
    const confirmationId = req.params.id;

    const filter = { _id: confirmationId, isDeleted: false };
    const options = { new: true };
    const confirmation = await Confirmation.deleteConfirmation(filter, options);

    if (confirmation.status === "FAILED") {
      throwError(
        confirmation.status,
        confirmation.error.statusCode,
        confirmation.error.message,
        confirmation.error.identifier
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
  createConfirmation,
  getConfirmations,
  getConfirmation,
  updateConfirmation,
  deleteConfirmation,
};
