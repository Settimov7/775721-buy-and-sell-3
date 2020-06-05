`use strict`;

const {Router} = require(`express`);

const {HttpStatusCode} = require(`../../constants`);
const {isOfferExists} = require(`../middlewares/is-offer-exists`);
const {isRequestDataValid} = require(`../middlewares/is-request-data-valid`);

const Route = {
  INDEX: `/`,
  OFFER: `/:offerId`,
  COMMENTS: `/:offerId/comments`,
  COMMENT: `/:offerId/comments/:commentId`,
};

const ExpectedProperties = {
  OFFER: [`category`, `description`, `title`, `type`, `sum`],
  COMMENT: [`text`],
};

const createOfferRouter = (service) => {
  const router = new Router();

  router.get(Route.INDEX, (req, res) => {
    const offers = service.findAll();

    res.status(HttpStatusCode.OK).json(offers);
  });

  router.post(Route.INDEX, isRequestDataValid(ExpectedProperties.OFFER), (req, res) => {
    const {category, description, picture, title, type, sum} = req.body;

    const newOffer = service.create({category, description, picture, title, type, sum});

    res.status(HttpStatusCode.CREATED).json(newOffer);
  });

  router.get(Route.OFFER, isOfferExists(service), (req, res) => {
    const {offerId} = req.params;
    const offer = service.findById(offerId);

    res.status(HttpStatusCode.OK).json(offer);
  });

  router.put(Route.OFFER, [isOfferExists(service), isRequestDataValid(ExpectedProperties.OFFER)], (req, res) => {
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

  router.get(Route.COMMENTS, isOfferExists(service), (req, res) => {
    const {offerId} = req.params;
    const comments = service.findAllComments(offerId);

    res.status(HttpStatusCode.OK).json(comments);
  });

  router.post(Route.COMMENTS, [isOfferExists(service), isRequestDataValid(ExpectedProperties.COMMENT)], (req, res) => {
    const {offerId} = req.params;
    const {text} = req.body;
    const newComment = service.createComment(offerId, text);

    res.status(HttpStatusCode.CREATED).json(newComment);
  });

  router.delete(Route.COMMENT, isOfferExists(service), (req, res) => {
    const {offerId, commentId} = req.params;
    const deletedComment = service.deleteComment(offerId, commentId);

    if (!deletedComment) {
      return res.status(HttpStatusCode.NOT_FOUND).send(`Not found comment with id: ${ offerId }`);
    }

    res.status(HttpStatusCode.OK).json(deletedComment);
  });

  return router;
};

exports.createOfferRouter = createOfferRouter;
