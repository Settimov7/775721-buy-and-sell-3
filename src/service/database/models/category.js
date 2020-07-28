'use strict';

module.exports = (sequelize, DataTypes) => {
  class Category extends sequelize.Sequelize.Model {
  }

  Category.init({
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
    },
    title: {
      type: DataTypes.STRING(50), /* eslint-disable-line */
      allowNull: false,
    },
    image: {
      type: DataTypes.TEXT,
    },
  }, {
    sequelize,
    timestamps: false,
    paranoid: false,
    modelName: `category`
  });

  return Category;
};
