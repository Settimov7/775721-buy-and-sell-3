'use strict';

const Joi = require(`joi`);

exports.commentParamsSchema = Joi.object({
  offerId: Joi.number(),
  commentId: Joi.number(),
});

exports.commentDataSchema = Joi.object({
  text: Joi.string()
  .min(20)
  .required(),
});
