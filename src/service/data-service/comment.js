'use strict';

const {nanoid} = require(`nanoid`);

const {MAX_ID_LENGTH} = require(`../../constants`);

class CommentService {
  findAll(offer) {
    return offer.comments;
  }

  create(offer, text) {
    const newComment = {
      id: nanoid(MAX_ID_LENGTH),
      text,
    };

    offer.comments.push(newComment);

    return newComment;
  }

  delete(offer, commentId) {
    const deletedComment = offer.comments.find(({id}) => id === commentId);

    if (!deletedComment) {
      return null;
    }

    offer.comments = offer.comments.filter(({id}) => id !== commentId);

    return deletedComment;
  }
}

exports.CommentService = CommentService;
