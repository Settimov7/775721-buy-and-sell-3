'use strict';

module.exports = (sequelize, DataTypes) => {
  class Offer extends sequelize.Sequelize.Model {
  }

  Offer.init({
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
    },
    title: {
      type: DataTypes.STRING(100), /* eslint-disable-line */
      allowNull: false,
    },
    image: {
      type: DataTypes.TEXT,
    },
    sum: {
      type: DataTypes.DOUBLE,
      allowNull: false,
    },
    type: {
      type: sequelize.Sequelize.ENUM,
      values: [`buy`, `sell`],
      allowNull: false,
    },
    description: {
      type: DataTypes.STRING(1000), /* eslint-disable-line */
      allowNull: false,
    },
  }, {
    sequelize,
    createdAt: `created_date`,
    updatedAt: false,
    paranoid: false,
    modelName: `offer`,
  });

  return Offer;
};
