'use strict';

exports.fillDataBase = async ({dataBase, mocks = {}}) => {
  const {sequelize, models} = dataBase;
  const {User, Category, Offer, Comment} = models;
  const {users = [], categories = [], offers = [], comments = [], offersCategories = []} = mocks;

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
    console.log(`Can't fill database. Error: ${ error }`);
  }
};
