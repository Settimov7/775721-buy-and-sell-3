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

  router.get(Route.INDEX, (req, res) => {
    const offers = offerService.findAll();

    res.status(HttpStatusCode.OK).json(offers);
  });

  router.post(Route.INDEX, isRequestDataValidMiddleware, (req, res) => {
    const {category, description, picture, title, type, sum} = req.body;

    const newOffer = offerService.create({category, description, picture, title, type, sum});

    res.status(HttpStatusCode.CREATED).json(newOffer);
  });

  router.get(Route.OFFER, isOfferExistsMiddleware, (req, res) => {
    const {offerId} = req.params;
    const offer = offerService.findById(offerId);

    res.status(HttpStatusCode.OK).json(offer);
  });

  router.put(Route.OFFER, [isOfferExistsMiddleware, isRequestDataValidMiddleware], (req, res) => {
    const {offerId} = req.params;

    const {category, description, picture, title, type, sum} = req.body;

    const updatedOffer = offerService.update({id: offerId, category, description, picture, title, type, sum});

    res.status(HttpStatusCode.OK).json(updatedOffer);
  });

  router.delete(Route.OFFER, isOfferExistsMiddleware, (req, res) => {
    const {offerId} = req.params;

    const deletedOffer = offerService.delete(offerId);

    res.status(HttpStatusCode.OK).json(deletedOffer);
  });

  router.use(Route.COMMENTS, isOfferExistsMiddleware, commentRouter);

  return router;
};

exports.createOfferRouter = createOfferRouter;
