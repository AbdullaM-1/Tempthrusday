const Joi = require("joi");

const createSchema = Joi.object({
  username: Joi.string()
    .max(30)
    .pattern(new RegExp(/^(?!.*\.\.)(?!.*\.$)[^\W][\w.]{0,29}$/))
    .required(),
  name: Joi.string().trim().uppercase().required(),
  phone: Joi.string().trim().required(),
  email: Joi.string()
    .pattern(new RegExp(/^[a-zA-Z0-9+_.-]+@[a-zA-Z0-9.-]+$/))
    .required(),
});

const updateSchema = Joi.object({
  username: Joi.string()
    .max(30)
    .pattern(new RegExp(/^(?!.*\.\.)(?!.*\.$)[^\W][\w.]{0,29}$/)),
  name: Joi.string().trim().uppercase(),
  phone: Joi.string().trim(),
  email: Joi.string().pattern(new RegExp(/^[a-zA-Z0-9+_.-]+@[a-zA-Z0-9.-]+$/)),
});

module.exports = {
  createSchema,
  updateSchema,
};
