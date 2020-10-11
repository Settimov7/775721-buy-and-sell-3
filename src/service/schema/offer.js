'use strict';

const Joi = require(`joi`);

exports.offerSchema = Joi.object({
  title: Joi.string()
  .min(10)
  .max(100)
  .required(),
  category: Joi.array()
  .items(Joi.string(), Joi.number())
  .min(1)
  .required(),
  description: Joi.string()
  .min(50)
  .max(1000)
  .required(),
  picture: Joi.string()
  .pattern(/\w\.(jpg|png)/),
  type: Joi.string()
  .valid(`buy`, `sell`)
  .required(),
  sum: Joi.number()
  .min(100)
  .required(),
});
