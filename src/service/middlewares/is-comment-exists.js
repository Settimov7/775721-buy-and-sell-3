'use strict';

const {HttpStatusCode} = require(`../../constants`);

const isCommentExists = ({service, logger}) => async (req, res, next) => {
  const {commentId} = req.params;

  try {
    const isNotExists = !await service.isExists(commentId);

    if (isNotExists) {
      res.status(HttpStatusCode.NOT_FOUND).send(`Not found comment with id: ${ commentId }`);

      return logger.error(`Cant find comment with id: ${ commentId }.`);
    }
  } catch (error) {
    next(error);
  }

  return next();
};

exports.isCommentExists = isCommentExists;
