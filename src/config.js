'use strict';

const dotenv = require(`dotenv`);

const {ExitCode} = require(`./constants`);

const {error, parsed} = dotenv.config();

if (error) {
  console.error(`Can't get env variables. Error: ${ error }`);

  process.exit(ExitCode.ERROR);
}

module.exports = {
  ...parsed,
};
