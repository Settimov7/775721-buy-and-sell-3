'use strict';

exports.createCommentModel = (sequelize, DataTypes) => {
  class Comment extends sequelize.Sequelize.Model {
  }

  Comment.init({
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
    },
    message: {
      type: DataTypes.STRING(300), /* eslint-disable-line */
      allowNull: false,
    },
  }, {
    sequelize,
    createdAt: `created_date`,
    updatedAt: false,
    paranoid: false,
    modelName: `comment`,
  });

  return Comment;
};

exports.createCommentAssociations = ({Comment, Offer, User}) => {
  Comment.belongsTo(User, {
    foreignKey: `user_id`,
  });

  Comment.belongsTo(Offer, {
    foreignKey: `offer_id`,
  });
};
