const Joi = require("joi");

const getStatsSchema = Joi.object({
  period: Joi.string().valid("weekly", "monthly", "yearly").default("monthly"),
  date: Joi.date().required(),
});

module.exports = { getStatsSchema };
