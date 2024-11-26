const Joi = require("joi");

const paginationSchema = Joi.object({
  page: Joi.number().min(1),
  limit: Joi.number().min(1),
});

const mogooseIdSchema = Joi.object({
  id: Joi.string().hex().length(24).required(),
});

module.exports = {
  paginationSchema,
  mogooseIdSchema,
};
