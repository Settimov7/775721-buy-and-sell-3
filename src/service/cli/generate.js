`use strict`;

const fs = require(`fs`).promises;

const chalk = require(`chalk`);

const {getRandomInt, shuffle, printNumWithLead0} = require(`../../utils`);
const {ExitCode} = require(`../../constants`);

const FILE_NAME = `mocks.json`;
const FILE_SENTENCES_PATH = `./data/sentences.txt`;
const FILE_TITLES_PATH = `./data/titles.txt`;
const FILE_CATEGORIES_PATH = `./data/categories.txt`;

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

const getPictureFileName = (number) => `item${ printNumWithLead0(number) }.jpg`;

const getRandomOfferType = (types) => types[getRandomInt(0, types.length - 1)];

const generateOffers = (count, {titles, categories, sentences}) => (
  Array(count).fill({}).map(() => ({
    category: shuffle(categories).slice(0, getRandomInt(CategoryRestrict.MIN, categories.length)),
    description: shuffle(sentences).slice(0, getRandomInt(DescriptionRestrict.MIN, DescriptionRestrict.MAX)).join(` `),
    picture: getPictureFileName(getRandomInt(PictureRestrict.MIN, PictureRestrict.MAX)),
    title: titles[getRandomInt(0, titles.length - 1)],
    type: getRandomOfferType(Object.values(OfferType)),
    sum: getRandomInt(SumRestrict.MIN, SumRestrict.MAX),
  }))
);

const readContent = async (filePath) => {
  let result = [];

  try {
    const content = await fs.readFile(filePath, `utf-8`);

    result = content.split(`\n`).filter(Boolean);
  } catch (error) {
    console.error(chalk.red(error));
  }

  return result;
};

module.exports = {
  name: `--generate`,
  async run(args) {
    const [rawCount] = args;
    const count = Number.parseInt(rawCount, 10) || OffersCount.DEFAULT;

    if (count > OffersCount.MAX) {
      console.error(chalk.red(`No more than ${ OffersCount.MAX } offers.`));

      process.exit(ExitCode.ERROR);
    }

    const titles = await readContent(FILE_TITLES_PATH);
    const categories = await readContent(FILE_CATEGORIES_PATH);
    const sentences = await readContent(FILE_SENTENCES_PATH);

    const content = JSON.stringify(generateOffers(count, {titles, categories, sentences}));

    try {
      await fs.writeFile(FILE_NAME, content);
    } catch (error) {
      console.error(chalk.red(`Can't write data to file...`));

      process.exit(ExitCode.ERROR);
    }

    console.info(chalk.green(`Operation success. File created.`));
  },
};
