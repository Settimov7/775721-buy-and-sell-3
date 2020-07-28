'use strict';

module.exports = (sequelize, DataTypes) => {
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
    modelName: `comment`
  });

  return Comment;
};
