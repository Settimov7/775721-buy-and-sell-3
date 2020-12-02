'use strict';

const {HttpStatusCode} = require(`../../constants`);

const isOfferBelongsToUser = ({service, logger}) => async (req, res, next) => {
  const {offerId} = req.params;
  const {userId} = res.locals;

  try {
    const isAuthorizedUserDidNotCreateThisOffer = !await service.isOfferBelongToUser(offerId, userId);

    if (isAuthorizedUserDidNotCreateThisOffer) {
      const message = `The offer with id ${offerId} does not belong to the authorized user`;

      res.status(HttpStatusCode.FORBIDDEN).send(message);

      return logger.error(message);
    }
  } catch (error) {
    next(error);
  }

  return next();
};

exports.isOfferBelongsToUser = isOfferBelongsToUser;
