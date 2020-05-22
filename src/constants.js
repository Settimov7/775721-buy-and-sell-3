'use strict';

module.exports.DEFAULT_COMMAND = `--help`;

module.exports.USER_ARGV_START_INDEX = 2;

module.exports.ExitCode = {
  ERROR: 1,
  SUCCESS: 0,
};

module.exports.HttpStatusCode = {
  OK: 200,
  NOT_FOUND: 404,
  ERROR: 500,
};
