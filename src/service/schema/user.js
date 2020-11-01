'use strict';

const Joi = require(`joi`);

exports.userDataSchema = Joi.object({
  name: Joi.string()
  .pattern(/^[a-zA-Zа-яА-Я\s]+$/)
  .max(50)
  .required(),
  email: Joi.string()
  .email()
  .max(320)
  .required(),
  password: Joi.string()
  .min(6)
  .required(),
  passwordRepeat: Joi.any()
  .valid(Joi.ref(`password`))
  .required(),
  avatar: Joi.string()
  .pattern(/\w\.(jpg|png)/)
  .allow(``),
});
