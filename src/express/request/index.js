'use strict';

const {promisify} = require(`util`);

const request = require(`request`);

const getRequestPromise = promisify(request.get);
const postRequestPromise = promisify(request.post);

const requestPromise = {
  get: getRequestPromise,
  post: postRequestPromise
};

exports.request = requestPromise;
