'use strict';

const {request} = require(`../request`);
const {API_URL} = require(`../constants`);
const {HttpStatusCode} = require(`../../constants`);
const {OFFERS_LIMIT_QUANTITY_ON_PAGE} = require(`./constants`);

exports.getHomePage = async (req, res, next) => {
  let offers = [];

  try {
    const {statusCode, body} = await request.get({
      url: `${ API_URL }/offers?limit=${ OFFERS_LIMIT_QUANTITY_ON_PAGE }`,
      json: true,
    });

    if (statusCode === HttpStatusCode.OK) {
      offers = body.offers;
    }
  } catch (error) {
    next(error);
  }

  res.render(`main/main`, {offers});
};

exports.getSearch = async (req, res, next) => {
  try {
    const encodedQuery = encodeURI(req.query.search);

    const {statusCode, body} = await request.get({url: `${ API_URL }/search?query=${ encodedQuery }`, json: true});
    const results = statusCode === HttpStatusCode.OK ? body : [];

    res.render(`main/search-result`, {results});
  } catch (error) {
    next(error);
  }
};
