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

exports.getRegister = async (req, res, next) => {
  try {
    res.render(`main/sign-up`);
  } catch (error) {
    next(error);
  }
};


exports.postRegister = async (req, res, next) => {
  try {
    const userData = req.fields;
    const {name, email, password, passwordRepeat, avatar} = userData;
    const [firstName, lastName] = name.split(` `);

    const userRequestBody = {
      firstName,
      lastName,
      email,
      password,
      passwordRepeat,
      avatar,
    };

    const {statusCode, body} = await request.post({url: `${ API_URL }/user`, json: true, body: userRequestBody});

    if (statusCode === HttpStatusCode.CREATED) {
      return res.redirect(`/login`);
    }

    const errorMessages = body.details.reduce((messages, {path, message}) => {
      const key = path.toString();

      messages[key] = message;

      return messages;
    }, {});

    return res.render(`main/sign-up`, { user: userData, errors: errorMessages });
  } catch (error) {
    return next(error);
  }
};
