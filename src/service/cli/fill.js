'use strict';

const fs = require(`fs`).promises;

const chalk = require(`chalk`);

const {createUsers, createCategories, createOffers, createComments, createOffersCategories} = require(`./utils`);
const {USERS_COUNT, OffersCount} = require(`./constants`);
const {ExitCode} = require(`../../constants`);

const FILE_NAME = `fill-db.sql`;

const EntityKeyToEntityPropertiesOrder = {
  users: [`id`, `firstName`, `lastName`, `email`, `password`, `avatar`],
  offers: [`id`, `title`, `image`, `sum`, `type`, `description`, `created_date`, `user_id`],
  categories: [`id`, `title`, `image`],
  [`offers_categories`]: [`offer_id`, `category_id`],
  comments: [`id`, `message`, `created_date`, `user_id`, `offer_id`],
};

const createValues = (entities, propertiesOrder) => entities.map((entity) => {
  let value = propertiesOrder.map((propertyKey) => {
    const entityValue = entity[propertyKey];

    return typeof entityValue === `string` ? `'${ entityValue }'` : entityValue;
  }).join(`,`);

  return `(${ value })`;
});

const createInsertCommand = ({tableName, entity, propertiesOrder}) => {
  const values = createValues(entity, propertiesOrder);

  return `--Add ${ tableName }\nINSERT INTO ${ tableName } VALUES\n${ values.join(`,\n`) };`;
};

const createCommandsForCreatingDBPrimaryData = (data) => {
  const createEntitiesCommands = Object.keys(data).map((entityKey) => {
    const entity = data[entityKey];
    const propertiesOrder = EntityKeyToEntityPropertiesOrder[entityKey];

    return createInsertCommand({tableName: entityKey, entity, propertiesOrder});
  });

  return createEntitiesCommands.join(`\n\n`);
};

module.exports = {
  name: `--fill`,
  async run(args) {
    const [rawCount] = args;

    const count = Number.parseInt(rawCount, 10) || OffersCount.DEFAULT;

    if (count < 0) {
      console.error(chalk.red(`Cant create ${ count } offers.`));

      process.exit(ExitCode.ERROR);
    }

    if (count > OffersCount.MAX) {
      console.error(chalk.red(`No more than ${ OffersCount.MAX } offers.`));

      process.exit(ExitCode.ERROR);
    }

    try {
      const users = createUsers(USERS_COUNT);
      const offers = await createOffers(count, users);
      const categories = await createCategories();
      const offersCategories = createOffersCategories(offers, categories);
      const comments = await createComments(users, offers);

      const commands = createCommandsForCreatingDBPrimaryData({
        users,
        offers,
        categories,
        [`offers_categories`]: offersCategories,
        comments,
      });

      await fs.writeFile(FILE_NAME, commands);
    } catch (error) {
      console.error(chalk.red(`Can't write data to file...`));

      process.exit(ExitCode.ERROR);
    }

    console.info(chalk.green(`Operation success. File ${ FILE_NAME } created.`));
  },
};
