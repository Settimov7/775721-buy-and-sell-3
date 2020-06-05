`use strict`;

const {HttpStatusCode} = require(`../../constants`);

const isOfferExists = (service) => (req, res, next) => {
  const {offerId} = req.params;
  const isNotExists = !service.isExists(offerId);

  if (isNotExists) {
    return res.status(HttpStatusCode.NOT_FOUND).send(`Not found offer with id: ${ offerId }`);
  }

  next();
};

exports.isOfferExists = isOfferExists;
