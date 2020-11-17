'use strict';

const Joi = require(`joi`);

const emailSchema = Joi.string()
  .email()
  .max(320)
  .required();
const passwordSchema = Joi.string()
  .min(6)
  .required();

exports.userRegisterDataSchema = Joi.object({
  name: Joi.string()
  .pattern(/^[a-zA-Zа-яА-Я\s]+$/)
  .max(50)
  .required(),
  email: emailSchema,
  password: passwordSchema,
  passwordRepeat: Joi.any()
  .valid(Joi.ref(`password`))
  .required(),
  avatar: Joi.string()
  .pattern(/\w\.(jpg|png)/)
  .allow(``),
});


exports.userLoginDataSchema = Joi.object({
  email: emailSchema,
  password: passwordSchema,
});
