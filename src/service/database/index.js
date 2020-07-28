'use strict';

const path = require(`path`);

const Sequelize = require(`sequelize`);

const {pinoLogger} = require(`../logger`);
const {DB_HOST, DB_PORT, DB_USER_NAME, DB_NAME, DB_PASSWORD} = require(`../../config`);

const DB_URI = `postgres://${DB_USER_NAME}:${DB_PASSWORD}@${DB_HOST}:${DB_PORT}/${DB_NAME}`;

const sequelize = new Sequelize(DB_URI, {
  logging: (message) => pinoLogger.debug(message),
});

const User = require(path.join(__dirname, `./models/user`))(sequelize, Sequelize.DataTypes);
const Offer = require(path.join(__dirname, `./models/offer`))(sequelize, Sequelize.DataTypes);
const Category = require(path.join(__dirname, `./models/category`))(sequelize, Sequelize.DataTypes);
const Comment = require(path.join(__dirname, `./models/comment`))(sequelize, Sequelize.DataTypes);

Offer.belongsTo(User, {
  foreignKey: `user_id`,
});

Offer.belongsToMany(Category, {
  through: `offers_categories`,
  foreignKey: `offer_id`,
  timestamps: false,
  paranoid: false,
});

Category.belongsToMany(Offer, {
  through: `offers_categories`,
  foreignKey: `category_id`,
});

Comment.belongsTo(User, {
  foreignKey: `user_id`,
});

Comment.belongsTo(Offer, {
  foreignKey: `offer_id`,
});

module.exports = {
  models: {
    User,
    Offer,
    Category,
    Comment,
  },
  sequelize,
};
