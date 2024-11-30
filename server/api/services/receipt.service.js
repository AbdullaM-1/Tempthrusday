const { DateTime } = require("luxon");
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

// GetReceiptsWithAssociation
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

const getStatsPipeline = (timeFrame, inputDate, userId) => {
  const endDate = DateTime.fromISO(inputDate).endOf("day"); // Reference date
  let startDate;

  // Determine the start date based on the timeframe
  switch (timeFrame) {
    case "weekly":
      startDate = endDate.minus({ days: 6 }).startOf("day"); // Last 7 days
      break;

    case "monthly":
      startDate = endDate.minus({ days: 29 }); // Last 30 days
      break;

    case "yearly":
      startDate = endDate.minus({ months: 11 }).startOf("month"); // Last 12 months
      break;
  }

  const groupByFormat = {
    weekly: {
      year: { $year: "$date" },
      month: { $month: "$date" },
      day: { $dayOfMonth: "$date" },
    },
    monthly: {
      year: { $year: "$date" },
      month: { $month: "$date" },
      day: { $dayOfMonth: "$date" },
    },
    yearly: {
      year: { $year: "$date" },
      month: { $month: "$date" },
    },
  };

  const filter = { isDeleted: false, date: { $gte: startDate.toJSDate() } };
  const pipeline = [{ $match: filter }];
  if (userId) {
    pipeline.push(
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
      {
        $match: {
          ...filter,
          $expr: {
            $eq: ["$associatedRecipient.user", { $toObjectId: userId }],
          },
        },
      }
    );
  }

  return [
    ...pipeline,
    {
      $group: {
        _id: groupByFormat[timeFrame],
        totalAmount: { $sum: "$amount" },
        totalCount: { $count: {} },
      },
    },
    {
      $project: { totalAmount: { $round: ["$totalAmount", 2] }, totalCount: 1 },
    },
    {
      $sort: { "_id.year": 1, "_id.month": 1, "_id.day": 1 }, // Sort by time
    },
  ];
};

// GetStats
const getStats = async (timeFrame, inputDate, userId) => {
  try {
    const pipeline = getStatsPipeline(timeFrame, inputDate, userId);
    const stats = await Receipt.aggregate(pipeline);

    return {
      status: "SUCCESS",
      data: stats,
    };
  } catch (error) {
    throwError("FAILED", 422, error.message, "0x000A11");
  }
};

const getStatsSummaryPipeline = (inputDate, userId) => {
  const today = DateTime.fromJSDate(inputDate, { zone: "utc" }).startOf("day");
  const endDay = DateTime.fromJSDate(inputDate, { zone: "utc" }).endOf("day");
  const yesterday = endDay.minus({ days: 1 }).startOf("day").toJSDate();
  const lastWeek = today.minus({ days: 6 }).startOf("day").toJSDate();
  const lastMonth = today.minus({ months: 1 }).startOf("day").toJSDate();
  const lastYear = today.minus({ years: 1 }).startOf("month").toJSDate();

  const group = { _id: null, totalAmount: { $sum: "$amount" } };
  if (!userId) {
    group.totalProfit = {
      $sum: { $multiply: ["$amount", { $divide: ["$commission", 100] }] },
    };
  }

  const filter = { isDeleted: false, date: { $gte: lastYear } };
  const pipeline = [{ $match: filter }];
  if (userId) {
    pipeline.push(
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
      {
        $match: {
          ...filter,
          $expr: {
            $eq: ["$associatedRecipient.user", { $toObjectId: userId }],
          },
        },
      }
    );
  }

  return [
    ...pipeline,
    {
      $facet: {
        daily: [{ $match: { date: { $gte: today } } }, { $group: group }],
        weekly: [
          { $match: { date: { $gte: lastWeek, $lte: yesterday } } },
          { $group: group },
        ],
        monthly: [
          { $match: { date: { $gte: lastMonth, $lt: yesterday } } },
          { $group: group },
        ],
        yearly: [
          { $match: { date: { $gte: lastYear, $lt: yesterday } } },
          { $group: group },
        ],
      },
    },
    {
      $project: {
        daily: { $arrayElemAt: ["$daily", 0] },
        weekly: { $arrayElemAt: ["$weekly", 0] },
        monthly: { $arrayElemAt: ["$monthly", 0] },
        yearly: { $arrayElemAt: ["$yearly", 0] },
      },
    },
    {
      $project: {
        daily: 1,
        weekly: 1,
        monthly: 1,
        yearly: 1,
        dailyDifference: {
          $cond: {
            if: { $gt: ["$daily.totalAmount", 0] },
            then: {
              $multiply: [
                {
                  $divide: [
                    {
                      $subtract: [
                        { $ifNull: ["$weekly.totalAmount", 0] },
                        "$daily.totalAmount",
                      ],
                    },
                    { $ifNull: ["$weekly.totalAmount", 1] },
                  ],
                },
                100,
              ],
            },
            else: 0,
          },
        },
        weeklyDifference: {
          $cond: {
            if: { $gt: ["$weekly.totalAmount", 0] },
            then: {
              $multiply: [
                {
                  $divide: [
                    {
                      $subtract: [
                        { $ifNull: ["$monthly.totalAmount", 0] },
                        "$weekly.totalAmount",
                      ],
                    },
                    { $ifNull: ["$monthly.totalAmount", 1] },
                  ],
                },
                100,
              ],
            },
            else: 0,
          },
        },
        monthlyDifference: {
          $cond: {
            if: { $gt: ["$monthly.totalAmount", 0] },
            then: {
              $multiply: [
                {
                  $divide: [
                    {
                      $subtract: [
                        { $ifNull: ["$yearly.totalAmount", 0] },
                        "$monthly.totalAmount",
                      ],
                    },
                    { $ifNull: ["$yearly.totalAmount", 1] },
                  ],
                },
                100,
              ],
            },
            else: 0,
          },
        },
        yearlyDifference: { $literal: 0 },
      },
    },
  ];
};

// GetStatsSummary
const getStatsSummary = async (inputDate, userId) => {
  try {
    const pipeline = getStatsSummaryPipeline(inputDate, userId);
    console.log(JSON.stringify(pipeline, null, 2));
    const stats = await Receipt.aggregate(pipeline);

    const formattedStats = {
      daily: {
        total: stats[0]?.daily?.totalAmount || 0,
        profit: stats[0]?.daily?.totalProfit || 0,
        difference: stats[0]?.dailyDifference || 0,
      },
      weekly: {
        total: stats[0]?.weekly?.totalAmount || 0,
        profit: stats[0]?.weekly?.totalProfit || 0,
        difference: stats[0]?.weeklyDifference || 0,
      },
      monthly: {
        total: stats[0]?.monthly?.totalAmount || 0,
        profit: stats[0]?.monthly?.totalProfit || 0,
        difference: stats[0]?.monthlyDifference || 0,
      },
      yearly: {
        total: stats[0]?.yearly?.totalAmount || 0,
        profit: stats[0]?.yearly?.totalProfit || 0,
        difference: stats[0]?.yearlyDifference || 0,
      },
    };

    return {
      status: "SUCCESS",
      data: formattedStats,
    };
  } catch (error) {
    throwError("FAILED", 422, error.message, "0x000A13");
  }
};

module.exports = {
  createReceipt,
  countReceiptsWithAssociation,
  getReceipts,
  getReceiptsWithAssociation,
  updateReceipt,
  deleteReceipt,
  getStats,
  getStatsSummary,
};
