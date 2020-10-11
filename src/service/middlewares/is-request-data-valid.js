'use strict';

const {HttpStatusCode} = require(`../../constants`);

const isRequestDataValid = ({schema, logger}) => async (req, res, next) => {
  const {body} = req;

  try {
    await schema.validateAsync(body, {abortEarly: false});
  } catch (error) {
    res.status(HttpStatusCode.BAD_REQUEST).send(`Invalid data`);

    return logger.error(`Invalid data. Data: ${ body }. Error: ${ error }`);
  }

  return next();
};

exports.isRequestDataValid = isRequestDataValid;
