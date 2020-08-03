'use strict';

exports.createOfferModel = (sequelize, DataTypes) => {
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
      type: DataTypes.DECIMAL(10, 2), /* eslint-disable-line */
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
    createdAt: {
      field: `created_date`,
      type: DataTypes.DATEONLY,
    },
  }, {
    sequelize,
    updatedAt: false,
    paranoid: false,
    modelName: `offer`,
  });

  return Offer;
};

exports.createOfferAssociations = ({Offer, User, Category, Comment}) => {
  Offer.belongsTo(User, {
    foreignKey: `user_id`,
  });

  Offer.belongsToMany(Category, {
    through: `offers_categories`,
    foreignKey: `offer_id`,
    timestamps: false,
    paranoid: false,
  });

  Offer.hasMany(Comment, {
    as: `comments`,
    foreignKey: `offer_id`,
  });
};
