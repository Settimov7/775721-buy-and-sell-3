'use strict';

exports.fillDataBase = async ({dataBase, mocks = {}}) => {
  const {sequelize, models} = dataBase;
  const {User, Category, Offer, Comment, RefreshToken} = models;
  const {users = [], categories = [], offers = [], comments = [], offersCategories = [], tokens = []} = mocks;

  try {
    await sequelize.sync({force: true});

    await Promise.all([
      User.bulkCreate(users),
      Category.bulkCreate(categories),
    ]);

    await sequelize.query(`ALTER SEQUENCE users_id_seq RESTART`);
    await sequelize.query(`UPDATE users SET id = DEFAULT`);

    await Offer.bulkCreate(offers);
    await Comment.bulkCreate(comments);

    await RefreshToken.bulkCreate(tokens);

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
    console.log(`Can't fill database. Error: ${ error }`);
  }
};
