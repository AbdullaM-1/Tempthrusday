const mongoose = require("mongoose");
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

// CountReceiptsWithAssociation
const countReceiptsWithAssociation = async (filter, userId) => {
  try {
    const match = userId
      ? {
          ...filter,
          $expr: {
            $eq: ["$associatedRecipient.user", { $toObjectId: userId }],
          },
        }
      : filter;

    const total = await Receipt.aggregate([
      { $match: filter },
      {
        $lookup: {
          from: "confirmations",
          localField: "confirmation",
          foreignField: "code",
          as: "associatedRecipient",
        },
      },
      {
        $unwind: {
          path: "$associatedRecipient",
          preserveNullAndEmptyArrays: userId ? false : true,
        },
      },
      { $match: match },
      { $count: "total" },
    ]);

    return { status: "SUCCESS", data: total[0]?.total || 0 };
  } catch (error) {
    throwError("FAILED", 422, error.message, "0x000A06");
  }
};

// GetReceipts
const getReceipts = async (filter, projection, page, limit, options = {}) => {
  try {
    const receipts = await Receipt.find(filter, projection, {
      ...options,
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
const getReceipt = async (filter, projection, options = {}) => {
  try {
    const receipt = await Receipt.findOne(filter, projection, options);

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

// getReceiptsWithAssociation
const getReceiptsWithAssociation = async (
  filter,
  projection,
  page,
  limit,
  userId
) => {
  try {
    const match = userId
      ? {
          ...filter,
          $expr: {
            $eq: ["$associatedRecipient.user", { $toObjectId: userId }],
          },
        }
      : filter;

    const aggregation = [
      { $match: filter },
      {
        $lookup: {
          from: "confirmations",
          localField: "confirmation",
          foreignField: "code",
          as: "associatedRecipient",
        },
      },
      {
        $unwind: {
          path: "$associatedRecipient",
          preserveNullAndEmptyArrays: userId ? false : true,
        },
      },
      { $match: match },
      { $project: projection },
      { $addFields: { associatedRecipient: "$associatedRecipient.user" } },
    ];

    if (page && limit) {
      aggregation.push({ $skip: (page - 1) * limit }, { $limit: limit });
    }

    const receipts = await Receipt.aggregate(aggregation);

    if (receipts && receipts.length) {
      return {
        status: "SUCCESS",
        data: page && limit ? receipts : receipts[0],
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

// // GetReceiptWithAssociation
// const getReceiptWithAssociation = async (filter, projection, userId) => {
//   try {
//     const match = {
//       ...filter,
//       $expr: {
//         $eq: ["$associatedRecipient.user", mongoose.Types.ObjectId(userId)],
//       },
//     };

//     const receipt = await Receipt.aggregate([
//       { $match: filter },
//       {
//         $lookup: {
//           from: "confirmations",
//           localField: "confirmation",
//           foreignField: "code",
//           as: "associatedRecipient",
//         },
//       },
//       { $unwind: "$associatedRecipient" },
//       { $match: match },
//       { $project: projection },
//       { $limit: 1 },
//     ]);

//     if (receipt && receipt.length) {
//       return {
//         status: "SUCCESS",
//         data: receipt[0],
//       };
//     } else {
//       return {
//         status: "FAILED",
//         error: {
//           statusCode: 404,
//           identifier: "0x000A04",
//           message: "Receipt not found",
//         },
//       };
//     }
//   } catch (error) {
//     throwError("FAILED", 422, error.message, "0x000A05");
//   }
// };

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
  countReceiptsWithAssociation,
  getReceipts,
  getReceipt,
  getReceiptsWithAssociation,
  updateReceipt,
  deleteReceipt,
};
