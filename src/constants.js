'use strict';

exports.DEFAULT_COMMAND = `--help`;

exports.USER_ARGV_START_INDEX = 2;

exports.MAX_ID_LENGTH = 6;

exports.ExitCode = {
  ERROR: 1,
  SUCCESS: 0,
};

exports.HttpStatusCode = {
  OK: 200,
  CREATED: 201,
  SEE_OTHER: 303,
  BAD_REQUEST: 400,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500,
};

exports.ContentFilePath = {
  SENTENCES: `./data/sentences.txt`,
  TITLES: `./data/titles.txt`,
  CATEGORIES: `./data/categories.txt`,
  COMMENTS: `./data/comments.txt`,
};
