`use strict`;

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

const createOfferRouter = (service, commentRouter) => {
  const router = new Router();

  router.get(Route.INDEX, (req, res) => {
    const offers = service.findAll();

    res.status(HttpStatusCode.OK).json(offers);
  });

  router.post(Route.INDEX, isRequestDataValid(EXPECTED_PROPERTIES), (req, res) => {
    const {category, description, picture, title, type, sum} = req.body;

    const newOffer = service.create({category, description, picture, title, type, sum});

    res.status(HttpStatusCode.CREATED).json(newOffer);
  });

  router.get(Route.OFFER, isOfferExists(service), (req, res) => {
    const {offerId} = req.params;
    const offer = service.findById(offerId);

    res.status(HttpStatusCode.OK).json(offer);
  });

  router.put(Route.OFFER, [isOfferExists(service), isRequestDataValid(EXPECTED_PROPERTIES)], (req, res) => {
    const {offerId} = req.params;

    const {category, description, picture, title, type, sum} = req.body;

    const updatedOffer = service.update({id: offerId, category, description, picture, title, type, sum});

    res.status(HttpStatusCode.OK).json(updatedOffer);
  });

  router.delete(Route.OFFER, isOfferExists(service), (req, res) => {
    const {offerId} = req.params;

    const deletedOffer = service.delete(offerId);

    res.status(HttpStatusCode.OK).json(deletedOffer);
  });

  router.use(Route.COMMENTS, isOfferExists(service), commentRouter);

  return router;
};

exports.createOfferRouter = createOfferRouter;
