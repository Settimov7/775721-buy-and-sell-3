`use strict`;

const {Router} = require(`express`);

const {HttpStatusCode} = require(`../../constants`);
const {isRequestDataValid} = require(`../middlewares/is-request-data-valid`);

const Route = {
  INDEX: `/`,
  COMMENT: `/:commentId`,
};

const EXPECTED_PROPERTIES = [`text`];

const createCommentRouter = (service) => {
  const router = new Router({mergeParams: true});

  router.get(Route.INDEX, (req, res) => {
    const {offerId} = req.params;
    const comments = service.findAllComments(offerId);

    res.status(HttpStatusCode.OK).json(comments);
  });

  router.post(Route.INDEX, isRequestDataValid(EXPECTED_PROPERTIES), (req, res) => {
    const {offerId} = req.params;
    const {text} = req.body;
    const newComment = service.createComment(offerId, text);

    res.status(HttpStatusCode.CREATED).json(newComment);
  });

  router.delete(Route.COMMENT, (req, res) => {
    const {offerId, commentId} = req.params;
    const deletedComment = service.deleteComment(offerId, commentId);

    if (!deletedComment) {
      return res.status(HttpStatusCode.NOT_FOUND).send(`Not found comment with id: ${ commentId }`);
    }

    res.status(HttpStatusCode.OK).json(deletedComment);
  });

  return router;
};

exports.createCommentRouter = createCommentRouter;
