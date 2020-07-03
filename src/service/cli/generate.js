'use strict';

const fs = require(`fs`).promises;

const chalk = require(`chalk`);
const {nanoid} = require(`nanoid`);

const {getRandomInt, shuffle, printNumWithLead0, readContent} = require(`../../utils`);
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

const OfferType = {
  OFFER: `offer`,
  SALE: `sale`,
};

const SumRestrict = {
  MIN: 1000,
  MAX: 100000,
};

const DescriptionRestrict = {
  MIN: 1,
  MAX: 5,
};

const CategoryRestrict = {
  MIN: 1,
};

const CommentTextRestrict = {
  MIN: 1,
  MAX: 3,
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
    text: shuffle(comments)
    .slice(0, getRandomInt(CommentTextRestrict.MIN, CommentTextRestrict.MAX))
    .join(` `),
  }))
);

const generateOffers = (count, {titles, categories, sentences, comments}) => (
  Array(count).fill({}).map(() => ({
    id: nanoid(MAX_ID_LENGTH),
    category: shuffle(categories).slice(0, getRandomInt(CategoryRestrict.MIN, categories.length)),
    description: shuffle(sentences).slice(0, getRandomInt(DescriptionRestrict.MIN, DescriptionRestrict.MAX)).join(` `),
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

    const titles = await readContent(ContentFilePath.TITLES);
    const categories = await readContent(ContentFilePath.CATEGORIES);
    const sentences = await readContent(ContentFilePath.SENTENCES);
    const comments = await readContent(ContentFilePath.COMMENTS);

    const content = JSON.stringify(generateOffers(count, {titles, categories, sentences, comments}));

    try {
      await fs.writeFile(FILE_NAME, content);
    } catch (error) {
      console.error(chalk.red(`Can't write data to file...`));

      process.exit(ExitCode.ERROR);
    }

    console.info(chalk.green(`Operation success. File created.`));
  },
};
