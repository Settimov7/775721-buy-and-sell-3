'use strict';

const fs = require(`fs`).promises;

const chalk = require(`chalk`);

const {createOfferDescription, createOfferCategories, createCommentMessage} = require(`./utils`);
const {printNumWithLead0} = require(`../../utils`);
const {getRandomInt, readContent} = require(`../../utils`);
const {OfferType} = require(`./constants`);
const {ExitCode, ContentFilePath} = require(`../../constants`);

const FILE_NAME = `fill-db.sql`;

const OffersCount = {
  DEFAULT: 1,
  MAX: 1000,
};

const USERS_COUNT = 2;

const USER_FIRST_NAMES = [
  {
    ru: `Иван`,
    eng: `Ivan`,
  },
  {
    ru: `Петр`,
    eng: `Petr`,
  },
  {
    ru: `Дмитрий`,
    eng: `Dmitry`,
  },
  {
    ru: `Сергей`,
    eng: `Sergei`,
  },
];

const USER_LAST_NAMES = [
  {
    ru: `Иванов`,
    eng: `Ivanov`,
  },
  {
    ru: `Петров`,
    eng: `Petrov`,
  },
  {
    ru: `Абрамов`,
    eng: `Abramov`,
  },
  {
    ru: `Васильев`,
    eng: `Vasiliev`,
  },
];

const PasswordRestrict = {
  MIN: 100000,
  MAX: 999999,
};

const OfferSumRestrict = {
  MIN: 10000,
  MAX: 99999999,
};

const NumberOfCommentsInOffer = {
  MIN: 2,
  MAX: 5,
};

const DAY_IN_MILLISECONDS = 86400000;

const DATE_LIMIT_IN_DAYS = 90;

const EntityKeyToEntityPropertiesOrder = {
  users: [`id`, `firstName`, `lastName`, `email`, `password`, `avatar`],
  offers: [`id`, `title`, `image`, `sum`, `type`, `description`, `createdDate`, `userId`],
  categories: [`id`, `title`, `image`],
  [`offers_categories`]: [`offerId`, `categoryId`],
  comments: [`id`, `message`, `createdDate`, `userId`, `offerId`],
};

const createRandomDate = () => {
  const date = new Date(Date.now() - getRandomInt(0, DAY_IN_MILLISECONDS * DATE_LIMIT_IN_DAYS));

  return date.toLocaleDateString();
};

const createUsers = (count) => Array.from({length: count}, (_, index) => {
  const id = index + 1;
  const firstName = USER_FIRST_NAMES[getRandomInt(0, USER_FIRST_NAMES.length - 1)];
  const lastName = USER_LAST_NAMES[getRandomInt(0, USER_LAST_NAMES.length - 1)];
  const email = `${ firstName.eng }_${ lastName.eng }_${ id }@mail.local`.toLowerCase();
  const password = getRandomInt(PasswordRestrict.MIN, PasswordRestrict.MAX);
  const avatar = `/img/avatar${ printNumWithLead0(id) }.jpg`;

  return {
    id,
    firstName: firstName.ru,
    lastName: lastName.ru,
    email,
    password,
    avatar,
  };
});

const createOffers = async (count, users) => {
  let offers = [];

  try {
    const titles = await readContent(ContentFilePath.TITLES);
    const sentences = await readContent(ContentFilePath.SENTENCES);
    const types = Object.values(OfferType);

    offers = Array.from({length: count}, (_, index) => {
      const user = users[getRandomInt(0, users.length - 1)];

      const id = index + 1;
      const title = titles[getRandomInt(0, titles.length - 1)];
      const image = `/img/item${ printNumWithLead0(id) }.jpg`;
      const sum = getRandomInt(OfferSumRestrict.MIN, OfferSumRestrict.MAX) / 100;
      const type = types[getRandomInt(0, types.length - 1)];
      const description = createOfferDescription(sentences);
      const createdDate = createRandomDate();
      const userId = user && user.id;

      return {
        id,
        title,
        image,
        sum,
        type,
        description,
        createdDate,
        userId,
      };
    });
  } catch (error) {
    console.error(chalk.red(`Can't create offers.`));
  }

  return offers;
};

const createCategories = async () => {
  let categories = [];

  try {
    const categoryNames = await readContent(ContentFilePath.CATEGORIES);

    categories = categoryNames.map((name, index) => {
      const id = index + 1;
      const image = `/img/category${ printNumWithLead0(id) }.jpg`;

      return {
        id,
        title: name,
        image,
      };
    });
  } catch (error) {
    console.error(chalk.red(`Can't create categories.`));
  }

  return categories;
};

const createOffersCategories = (offers, categories) =>
  offers.reduce((offersCategories, offer) => {
    const currentOfferCategories = createOfferCategories(categories)
    .map(({id}) => ({
      offerId: offer.id,
      categoryId: id,
    }));

    return [...offersCategories, ...currentOfferCategories];

  }, []);

const createComments = async (users, offers) => {
  let comments = [];

  try {
    const commentMessages = await readContent(ContentFilePath.COMMENTS);

    comments = offers.reduce((offersComments, offer) => {
      const numberOfComments = getRandomInt(NumberOfCommentsInOffer.MIN, NumberOfCommentsInOffer.MAX);
      const currentOfferComments = Array.from({length: numberOfComments}, (_, index) => {
        const lastOffer = offersComments[offersComments.length - 1];
        const lastIndex = lastOffer ? lastOffer.id : 0;
        const id = lastIndex + index + 1;

        const user = users[getRandomInt(0, users.length - 1)];

        const message = createCommentMessage(commentMessages);
        const createdDate = createRandomDate();
        const userId = user && user.id;

        return {
          id,
          message,
          createdDate,
          userId,
          offerId: offer.id,
        };
      });

      return [...offersComments, ...currentOfferComments];
    }, []);
  } catch (error) {
    console.error(chalk.red(`Can't create comments.`));
  }

  return comments;
};

const createValues = (entities, propertiesOrder) => entities.map((entity) => {
  let value = propertiesOrder.map((propertyKey) => {
    const entityValue = entity[propertyKey];

    return typeof entityValue === `string` ? `'${entityValue}'` : entityValue;
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
