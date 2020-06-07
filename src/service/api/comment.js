`use strict`;

const {Router} = require(`express`);

const {HttpStatusCode} = require(`../../constants`);
const {isRequestDataValid} = require(`../middlewares/is-request-data-valid`);

const Route = {
  INDEX: `/`,
  COMMENT: `/:commentId`,
};

const EXPECTED_PROPERTIES = [`text`];

const createCommentRouter = (offerService, commentService) => {
  const router = new Router({mergeParams: true});

  router.get(Route.INDEX, (req, res) => {
    const {offerId} = req.params;
    const offer = offerService.findById(offerId);
    const comments = commentService.findAll(offer);

    res.status(HttpStatusCode.OK).json(comments);
  });

  router.post(Route.INDEX, isRequestDataValid(EXPECTED_PROPERTIES), (req, res) => {
    const {offerId} = req.params;
    const {text} = req.body;
    const offer = offerService.findById(offerId);
    const newComment = commentService.create(offer, text);

    res.status(HttpStatusCode.CREATED).json(newComment);
  });

  router.delete(Route.COMMENT, (req, res) => {
    const {offerId, commentId} = req.params;
    const offer = offerService.findById(offerId);
    const deletedComment = commentService.delete(offer, commentId);

    if (!deletedComment) {
      return res.status(HttpStatusCode.NOT_FOUND).send(`Not found comment with id: ${ commentId }`);
    }

    res.status(HttpStatusCode.OK).json(deletedComment);
  });

  return router;
};

exports.createCommentRouter = createCommentRouter;
