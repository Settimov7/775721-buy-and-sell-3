'use strict';

const {HttpStatusCode} = require(`../../constants`);

const isOfferExists = ({service, logger}) => (req, res, next) => {
  const {offerId} = req.params;
  const isNotExists = !service.isExists(offerId);

  if (isNotExists) {
    res.status(HttpStatusCode.NOT_FOUND).send(`Not found offer with id: ${ offerId }`);

    return logger.error(`Cant find offer with id: ${ offerId }. End request with error: ${ res.statusCode }`);
  }

  return next();
};

exports.isOfferExists = isOfferExists;
