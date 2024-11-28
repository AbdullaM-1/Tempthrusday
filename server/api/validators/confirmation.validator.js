const Joi = require("joi");

const createSchema = Joi.object({
  code: Joi.string().required(),
});

const updateSchema = Joi.object({
  code: Joi.string().required(),
});

module.exports = {
  createSchema,
  updateSchema,
};
