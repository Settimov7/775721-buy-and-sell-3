'use strict';

const {HttpStatusCode} = require(`../../constants`);

const isOfferExists = ({service, logger}) => async (req, res, next) => {
  const {offerId} = req.params;

  try {
    const isNotExists = !await service.isExists(offerId);

    if (isNotExists) {
      res.status(HttpStatusCode.NOT_FOUND).send(`Not found offer with id: ${ offerId }`);

      return logger.error(`Cant find offer with id: ${ offerId }.`);
    }
  } catch (error) {
    next(error);
  }

  return next();
};

exports.isOfferExists = isOfferExists;
