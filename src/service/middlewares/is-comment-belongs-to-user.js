'use strict';

const {HttpStatusCode} = require(`../../constants`);

const isCommentBelongsToUser = ({service, logger}) => async (req, res, next) => {
  const {commentId} = req.params;
  const {userId} = res.locals;

  try {
    const isAuthorizedUserDidNotCreateThisComment = !await service.isCommentBelongToUser(commentId, userId);

    if (isAuthorizedUserDidNotCreateThisComment) {
      const message = `The comment with id ${commentId} does not belong to the authorized user`;

      res.status(HttpStatusCode.FORBIDDEN).send(message);

      return logger.error(message);
    }
  } catch (error) {
    next(error);
  }

  return next();
};

exports.isCommentBelongsToUser = isCommentBelongsToUser;
