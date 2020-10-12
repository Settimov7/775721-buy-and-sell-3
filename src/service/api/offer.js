'use strict';

const {Router} = require(`express`);

const {HttpStatusCode} = require(`../../constants`);
const {isOfferExists} = require(`../middlewares/is-offer-exists`);
const {isRequestParamsValid} = require(`../middlewares/is-request-params-valid`);
const {isRequestDataValid} = require(`../middlewares/is-request-data-valid`);
const {offerDataSchema, offerParamsSchema} = require(`../schema/offer`);

const Route = {
  INDEX: `/`,
  OFFER: `/:offerId`,
  COMMENTS: `/:offerId/comments`,
};

const createOfferRouter = ({offerService, commentRouter, logger}) => {
  const router = new Router();

  const isRequestParamsMiddleware = isRequestParamsValid({schema: offerParamsSchema, logger});
  const isRequestDataValidMiddleware = isRequestDataValid({schema: offerDataSchema, logger});
  const isOfferExistsMiddleware = isOfferExists({service: offerService, logger});

  router.get(Route.INDEX, async (req, res, next) => {
    try {
      const {offset, limit} = req.query;

      const result = await offerService.findAll({offset, limit});

      res.status(HttpStatusCode.OK).json(result);
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

  router.get(Route.OFFER, [isRequestParamsMiddleware, isOfferExistsMiddleware], async (req, res, next) => {
    const {offerId} = req.params;

    try {
      const offer = await offerService.findById(offerId);

      res.status(HttpStatusCode.OK).json(offer);
    } catch (error) {
      next(error);
    }
  });

  router.put(Route.OFFER, [isRequestParamsMiddleware, isOfferExistsMiddleware, isRequestDataValidMiddleware], async (req, res, next) => {
    const {offerId} = req.params;
    const {category, description, picture, title, type, sum} = req.body;

    try {
      const updatedOffer = await offerService.update({id: offerId, category, description, picture, title, type, sum});

      res.status(HttpStatusCode.OK).json(updatedOffer);
    } catch (error) {
      next(error);
    }
  });

  router.delete(Route.OFFER, [isRequestParamsMiddleware, isOfferExistsMiddleware], async (req, res, next) => {
    const {offerId} = req.params;

    try {
      const deletedOffer = await offerService.delete(offerId);

      res.status(HttpStatusCode.OK).json(deletedOffer);
    } catch (error) {
      next(error);
    }
  });

  router.use(Route.COMMENTS, [isRequestParamsMiddleware, isOfferExistsMiddleware], commentRouter);

  return router;
};

exports.createOfferRouter = createOfferRouter;
