'use strict';

const Joi = require(`joi`);

exports.commentSchema = Joi.object({
  text: Joi.string()
  .min(20)
  .required(),
});
