'use strict';

const {Router} = require(`express`);

const {HttpStatusCode} = require(`../../constants`);
const {isOfferExists} = require(`../middlewares/is-offer-exists`);
const {isRequestDataValid} = require(`../middlewares/is-request-data-valid`);

const Route = {
  INDEX: `/`,
  OFFER: `/:offerId`,
  COMMENTS: `/:offerId/comments`,
};

const EXPECTED_PROPERTIES = [`category`, `description`, `title`, `type`, `sum`];

const createOfferRouter = ({offerService, commentRouter, logger}) => {
  const router = new Router();
  const isRequestDataValidMiddleware = isRequestDataValid({expectedProperties: EXPECTED_PROPERTIES, logger});
  const isOfferExistsMiddleware = isOfferExists({service: offerService, logger});

  router.get(Route.INDEX, async (req, res, next) => {
    try {
      const {offset, limit} = req.query;

      const offers = await offerService.findAll({offset, limit});

      res.status(HttpStatusCode.OK).json(offers);
    } catch (error) {
      next(error);
    }
  });

  router.post(Route.INDEX, isRequestDataValidMiddleware, async (req, res, next) => {
    const {category, description, picture, title, type, sum} = req.body;

    try {
      const newOffer = await offerService.create({categories: category, description, picture, title, type, sum});

      res.status(HttpStatusCode.CREATED).json(newOffer);
    } catch (error) {
      next(error);
    }
  });

  router.get(Route.OFFER, isOfferExistsMiddleware, async (req, res, next) => {
    const {offerId} = req.params;

    try {
      const offer = await offerService.findById(offerId);

      res.status(HttpStatusCode.OK).json(offer);
    } catch (error) {
      next(error);
    }
  });

  router.put(Route.OFFER, [isOfferExistsMiddleware, isRequestDataValidMiddleware], async (req, res, next) => {
    const {offerId} = req.params;
    const {category, description, picture, title, type, sum} = req.body;

    try {
      const updatedOffer = await offerService.update({id: offerId, category, description, picture, title, type, sum});

      res.status(HttpStatusCode.OK).json(updatedOffer);
    } catch (error) {
      next(error);
    }
  });

  router.delete(Route.OFFER, isOfferExistsMiddleware, async (req, res, next) => {
    const {offerId} = req.params;

    try {
      const deletedOffer = await offerService.delete(offerId);

      res.status(HttpStatusCode.OK).json(deletedOffer);
    } catch (error) {
      next(error);
    }
  });

  router.use(Route.COMMENTS, isOfferExistsMiddleware, commentRouter);

  return router;
};

exports.createOfferRouter = createOfferRouter;
