'use strict';

class CommentService {
  constructor(dataBase, logger) {
    this._dataBase = dataBase;
    this._models = dataBase.models;
    this._logger = logger;
    this._selectOptions = {
      raw: true,
      attributes: [
        `id`,
        `message`,
        `created_date`,
      ],
    };
  }

  async findAll(offerId) {
    const {Offer} = this._models;

    try {
      const offer = await Offer.findByPk(offerId);

      return await offer.getComments(this._selectOptions);
    } catch (error) {
      this._logger.error(`Can't find comments for offer with id ${ offerId }. Error: ${ error }`);

      return null;
    }
  }

  async create(offerId, text) {
    const {Offer, Comment} = this._models;

    try {
      const offer = await Offer.findByPk(offerId);

      const newComment = await offer.createComment({
        message: text,
        user_id: 1, /* eslint-disable-line */
      });

      return await Comment.findByPk(newComment.id, this._selectOptions);
    } catch (error) {
      this._logger.error(`Can't create comment for offer with id ${ offerId }. Error: ${ error }`);

      return null;
    }
  }

  async delete(id) {
    const {Comment} = this._models;

    try {
      const deletedComment = await Comment.findByPk(id, this._selectOptions);
      const deletedRows = await Comment.destroy({
        where: {
          id,
        },
        ...this._selectOptions,
      });

      if (!deletedRows) {
        return null;
      }

      return deletedComment;
    } catch (error) {
      this._logger.error(`Can't delete comment with id: ${ id }. Error: ${ error }`);

      return null;
    }
  }
}

exports.CommentService = CommentService;
