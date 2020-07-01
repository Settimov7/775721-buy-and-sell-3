'use strict';

const {request} = require(`../request`);
const {HttpStatusCode} = require(`../../constants`);

exports.getHomePage = async (req, res, next) => {
  try {
    const {statusCode, body} = await request.get({url: `http://localhost:3000/api/offers`, json: true});
    const offers = statusCode === HttpStatusCode.OK ? body : [];

    res.render(`main/main`, {offers});
  } catch (error) {
    next(error);
  }
};

exports.getSearch = async (req, res, next) => {
  try {
    const encodedQuery = encodeURI(req.query.search);

    const {statusCode, body} = await request.get({
      url: `http://localhost:3000/api/search?query=${ encodedQuery }`,
      json: true,
    });
    const results = statusCode === HttpStatusCode.OK ? body : [];

    res.render(`main/search-result`, {results});
  } catch (error) {
    next(error);
  }
};
