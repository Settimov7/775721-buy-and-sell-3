`use strict`;

const fs = require(`fs`).promises;

const FILE_MOCKS_PATH = `./mocks.json`;

let data = [];

exports.getMockData = async () => {
  if (data.length) {
    return data;
  }

  try {
    const offers = await fs.readFile(FILE_MOCKS_PATH);

    data = JSON.parse(offers);
  } catch (error) {
    console.error(error);
  }

  return data;
};
