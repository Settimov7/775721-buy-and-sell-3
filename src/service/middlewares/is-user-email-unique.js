'use strict';

const {HttpStatusCode} = require(`../../constants`);

const isUserEmailUnique = ({service, logger}) => async (req, res, next) => {
  const {email} = req.body;

  try {
    const isExists = await service.isExist(email);

    if (isExists) {
      res.status(HttpStatusCode.BAD_REQUEST).send(`We have user with the same email: ${ email }`);

      return logger.error(`We have user with the same email: ${ email }.`);
    }
  } catch (error) {
    next(error);
  }

  return next();
};

exports.isUserEmailUnique = isUserEmailUnique;
