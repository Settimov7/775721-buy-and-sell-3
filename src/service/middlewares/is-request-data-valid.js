'use strict';

const {HttpStatusCode} = require(`../../constants`);
const {hasAllExpectedProperties} = require(`../../utils`);

const isRequestDataValid = ({expectedProperties, logger}) => (req, res, next) => {
  const hasNotAllProperties = !hasAllExpectedProperties(req.body, expectedProperties);

  if (hasNotAllProperties) {
    res.status(HttpStatusCode.BAD_REQUEST).send(`Invalid data`);

    return logger.error(`Expected next properties: ${ expectedProperties }, but received: ${ Object.keys(req.body) }. End request with error: ${ res.statusCode }`);
  }

  return next();
};

exports.isRequestDataValid = isRequestDataValid;
