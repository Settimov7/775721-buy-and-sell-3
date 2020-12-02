'use strict';

const {promisify} = require(`util`);

const request = require(`request`);

const getRequestPromise = promisify(request.get);
const postRequestPromise = promisify(request.post);
const deleteRequestPromise = promisify(request.delete);

const requestPromise = {
  get: getRequestPromise,
  post: postRequestPromise,
  delete: deleteRequestPromise,
};

exports.request = requestPromise;
