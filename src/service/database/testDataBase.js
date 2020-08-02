'use strict';

const Sequelize = require(`sequelize`);

const {createModels} = require(`./createModels`);
const {TEST_DB_HOST, TEST_DB_PORT, TEST_DB_USER_NAME, TEST_DB_NAME, TEST_DB_PASSWORD} = require(`../../config`);

const DB_URI = `postgres://${ TEST_DB_USER_NAME }:${ TEST_DB_PASSWORD }@${ TEST_DB_HOST }:${ TEST_DB_PORT }/${ TEST_DB_NAME }`;

const sequelize = new Sequelize(DB_URI, {
  logging: false,
});

const models = createModels(sequelize);

const resetDataBase = async ({users = [], categories = [], offers = [], comments = [], offersCategories = []}) => {
  const {User, Category, Offer, Comment} = models;

  try {
    await sequelize.sync({force: true});

    await Promise.all([
      User.bulkCreate(users),
      Category.bulkCreate(categories),
    ]);

    await Offer.bulkCreate(offers);
    await Comment.bulkCreate(comments);

    const addCategoryPromises = offersCategories.map(async ({offerId, categoriesIds}) => {
      const offer = await Offer.findByPk(offerId);
      const offerCategories = await Category.findAll({
        where: {
          id: {
            [sequelize.Sequelize.Op.or]: categoriesIds,
          },
        },
      });

      await offer.addCategories(offerCategories);
    });

    await Promise.all(addCategoryPromises);
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  models,
  sequelize,
  resetDataBase,
};
