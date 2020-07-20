'use strict';

const fs = require(`fs`).promises;

const chalk = require(`chalk`);
const {nanoid} = require(`nanoid`);

const {OfferType} = require(`./constants`);
const {createOfferDescription, createOfferCategories, createCommentMessage} = require(`./utils`);
const {getRandomInt, printNumWithLead0, readContent} = require(`../../utils`);
const {ExitCode, MAX_ID_LENGTH, ContentFilePath} = require(`../../constants`);

const FILE_NAME = `mocks.json`;

const OffersCount = {
  DEFAULT: 1,
  MAX: 1000,
};

const PictureRestrict = {
  MIN: 1,
  MAX: 16,
};

const SumRestrict = {
  MIN: 1000,
  MAX: 100000,
};

const CommentsRestrict = {
  MIN: 1,
  MAX: 5,
};

const getPictureFileName = (number) => `item${ printNumWithLead0(number) }.jpg`;

const getRandomOfferType = (types) => types[getRandomInt(0, types.length - 1)];

const generateComments = (count, comments) => (
  Array(count).fill({}).map(() => ({
    id: nanoid(MAX_ID_LENGTH),
    text: createCommentMessage(comments),
  }))
);

const generateOffers = (count, {titles, categories, sentences, comments}) => (
  Array(count).fill({}).map(() => ({
    id: nanoid(MAX_ID_LENGTH),
    category: createOfferCategories(categories),
    description: createOfferDescription(sentences),
    picture: getPictureFileName(getRandomInt(PictureRestrict.MIN, PictureRestrict.MAX)),
    title: titles[getRandomInt(0, titles.length - 1)],
    type: getRandomOfferType(Object.values(OfferType)),
    sum: getRandomInt(SumRestrict.MIN, SumRestrict.MAX),
    comments: generateComments(getRandomInt(CommentsRestrict.MIN, CommentsRestrict.MAX), comments),
  }))
);

module.exports = {
  name: `--generate`,
  async run(args) {
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
      const titles = await readContent(ContentFilePath.TITLES);
      const categories = await readContent(ContentFilePath.CATEGORIES);
      const sentences = await readContent(ContentFilePath.SENTENCES);
      const comments = await readContent(ContentFilePath.COMMENTS);

      const content = JSON.stringify(generateOffers(count, {titles, categories, sentences, comments}));

      await fs.writeFile(FILE_NAME, content);
    } catch (error) {
      console.error(chalk.red(`Can't write data to file...`));

      process.exit(ExitCode.ERROR);
    }

    console.info(chalk.green(`Operation success. File created.`));
  },
};
