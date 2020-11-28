'use strict';

const {request} = require(`../request`);
const {AUTHORIZATION_KEY} = require(`../constants`);
const {HttpStatusCode} = require(`../../constants`);
const {OFFERS_LIMIT_QUANTITY_ON_PAGE} = require(`./constants`);
const {parseErrorDetailsToErrorMessages} = require(`./utils`);
const {API_URL} = require(`../../config`);

exports.getHomePage = async (req, res, next) => {
  let offers = [];

  try {
    const {statusCode, body} = await request.get({
      url: `${API_URL}/offers?limit=${OFFERS_LIMIT_QUANTITY_ON_PAGE}`,
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

    const {statusCode, body} = await request.get({url: `${API_URL}/search?query=${encodedQuery}`, json: true});
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

    const {statusCode, body} = await request.post({url: `${API_URL}/user`, json: true, body: userData});

    if (statusCode === HttpStatusCode.CREATED) {
      return res.redirect(HttpStatusCode.SEE_OTHER, `/login`);
    }

    const errorMessages = parseErrorDetailsToErrorMessages(body.details);

    return res.render(`main/sign-up`, {user: userData, errors: errorMessages});
  } catch (error) {
    return next(error);
  }
};

exports.getLogin = async (req, res, next) => {
  try {
    res.render(`main/login`);
  } catch (error) {
    next(error);
  }
};

exports.postLogin = async (req, res, next) => {
  const loginData = req.fields;

  try {
    const {statusCode, body} = await request.post({url: `${API_URL}/user/login`, json: true, body: loginData});

    if (statusCode === HttpStatusCode.FORBIDDEN) {
      const errorMessages = parseErrorDetailsToErrorMessages(body.details);

      return res.render(`main/login`, {errors: errorMessages});
    }

    if (statusCode === HttpStatusCode.OK) {
      const {accessToken, refreshToken} = body;

      res.cookie(AUTHORIZATION_KEY, `Bearer ${accessToken} ${refreshToken}`, {httpOnly: true});

      return res.redirect(`/`);
    }

    return res.render(`main/login`);
  } catch (error) {
    return next(error);
  }
};

exports.getLogout = async (req, res, next) => {
  const {headers, tokens} = res.locals;

  try {
    const {statusCode} = await request.delete({
      url: `${API_URL}/user/logout`,
      json: true,
      headers,
      body: {token: tokens.refreshToken},
    });

    if (statusCode === HttpStatusCode.NO_CONTENT) {
      res.clearCookie(AUTHORIZATION_KEY);
      res.redirect(`/`);
    }
  } catch (error) {
    next(error);
  }
};
