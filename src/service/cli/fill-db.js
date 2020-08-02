'use strict';

const chalk = require(`chalk`);

const dataBase = require(`../database`);
const {fillDataBase} = require(`../database/fill-data-base`);
const {createUsers, createCategories, createOffers, createOffersCategories, createComments, flattenOffersCategories} = require(`./utils`);
const {USERS_COUNT, OffersCount} = require(`./constants`);
const {ExitCode} = require(`../../constants`);

module.exports = {
  name: `--fill-db`,
  async run(args) {
    const {sequelize} = dataBase;
    const [rawCount] = args;

    const count = Number.parseInt(rawCount, 10) || OffersCount.DEFAULT;

    if (count > OffersCount.MAX) {
      console.error(chalk.red(`No more than ${ OffersCount.MAX } offers.`));

      process.exit(ExitCode.ERROR);
    }

    if (count < 0) {
      console.error(chalk.red(`Cant create ${ count } offers.`));

      process.exit(ExitCode.ERROR);
    }

    try {
      console.info(chalk.green(`Trying to connect to the database`));

      const result = await sequelize.sync();

      console.info(chalk.green(`Successfully connected to ${ result.config.database } database`));
    } catch (error) {
      console.error(chalk.red(`Can't connect to database. Error: ${ error }`));

      process.exit(ExitCode.ERROR);
    }

    try {
      const users = createUsers(USERS_COUNT);
      const categories = await createCategories();
      const offers = await createOffers(count, users);
      const comments = await createComments(users, offers);
      const offersCategories = flattenOffersCategories(createOffersCategories(offers, categories));

      sequelize.close();

      await fillDataBase({
        dataBase,
        mocks: {
          users,
          categories,
          offers,
          comments,
          offersCategories,
        },
      });

      dataBase.sequelize.close();
    } catch (error) {
      console.log(chalk.red(`Can't fill database. Error: ${ error }`));
    }

    console.info(chalk.green(`Database successfully filled.`));
  },
};
