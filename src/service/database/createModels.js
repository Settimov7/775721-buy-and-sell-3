'use strict';

const {createUserModel, createUserAssociations} = require(`./models/user`);
const {createOfferModel, createOfferAssociations} = require(`./models/offer`);
const {createCategoryModel, createCategoryAssociations} = require(`./models/category`);
const {createCommentModel, createCommentAssociations} = require(`./models/comment`);

exports.createModels = (sequelize) => {
  const DataTypes = sequelize.Sequelize.DataTypes;

  const User = createUserModel(sequelize, DataTypes);
  const Offer = createOfferModel(sequelize, DataTypes);
  const Category = createCategoryModel(sequelize, DataTypes);
  const Comment = createCommentModel(sequelize, DataTypes);

  createOfferAssociations({Offer, Category, User});
  createUserAssociations({Offer, User});
  createCategoryAssociations({Offer, Category});
  createCommentAssociations({Comment, Offer, User});

  return {
    User,
    Offer,
    Category,
    Comment,
  };
};
