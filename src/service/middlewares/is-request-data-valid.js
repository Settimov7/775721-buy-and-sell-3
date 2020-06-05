`use strict`;

const {HttpStatusCode} = require(`../../constants`);
const {hasAllExpectedProperties} = require(`../../utils`);

const isRequestDataValid = (expectedProperties) => (req, res, next) => {
  const hasNotAllProperties = !hasAllExpectedProperties(req.body, expectedProperties);

  if (hasNotAllProperties) {
    return res.status(HttpStatusCode.BAD_REQUEST).send(`Invalid data`);
  }

  next();
};

exports.isRequestDataValid = isRequestDataValid;
