'use strict';

const {promisify} = require(`util`);

const request = require(`request`);

const getRequestPromise = promisify(request.get);

const requestPromise = {
  get: getRequestPromise,
};

exports.request = requestPromise;
