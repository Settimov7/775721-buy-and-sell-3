'use strict';

const {HttpStatusCode} = require(`../../constants`);

const isRequestParamsValid = ({schema, logger}) => async (req, res, next) => {
  const {params} = req;

  try {
    await schema.validateAsync(params, {abortEarly: false});
  } catch (error) {
    res.status(HttpStatusCode.BAD_REQUEST).send(`Invalid params`);

    return logger.error(`Invalid params. Params: ${ params }. Error: ${ error }`);
  }

  return next();
};

exports.isRequestParamsValid = isRequestParamsValid;
