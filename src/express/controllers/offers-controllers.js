'use strict';

const {request} = require(`../request`);
const {API_URL} = require(`../constants`);
const {HttpStatusCode} = require(`../../constants`);

exports.getAddPost = async (req, res, next) => {
  try {
    const {statusCode, body: categories} = await request.get({url: `${ API_URL }/categories`, json: true});

    if (statusCode === HttpStatusCode.NOT_FOUND) {
      res.status(HttpStatusCode.NOT_FOUND).render(`errors/404`);
    }

    res.render(`offers/new-ticket`, {categories});
  } catch (error) {
    next(error);
  }
};

exports.postAddPost = async (req, res, next) => {
  try {
    const {avatar, title, description, category, sum, type} = req.body;

    const offerCategories = Array.isArray(category) ? category : [category];

    const offer = {
      title,
      type,
      category: offerCategories,
      description,
      picture: avatar,
      sum,
    };

    const {statusCode} = await request.post({url: `${ API_URL }/offers`, json: true, body: offer});

    if (statusCode === HttpStatusCode.CREATED) {
      return res.redirect(`/my`);
    }

    const categoriesResult = await request.get({url: `${ API_URL }/categories`, json: true});

    if (categoriesResult.statusCode === HttpStatusCode.NOT_FOUND) {
      res.status(HttpStatusCode.NOT_FOUND).render(`errors/404`);
    }

    return res.render(`offers/new-ticket`, {
      categories: categoriesResult.body,
      action: `http://localhost:8080/offers/add`,
      offer,
    });
  } catch (error) {
    return next(error);
  }
};

exports.getPostEdit = async (req, res, next) => {
  try {
    const {id} = req.params;
    const offersResult = await request.get({url: `${ API_URL }/offers/${ id }`, json: true});

    if (offersResult.statusCode === HttpStatusCode.NOT_FOUND) {
      res.status(HttpStatusCode.NOT_FOUND).render(`errors/404`);
    }

    const categoriesResult = await request.get({url: `${ API_URL }/categories`, json: true});

    if (categoriesResult.statusCode === HttpStatusCode.NOT_FOUND) {
      res.status(HttpStatusCode.NOT_FOUND).render(`errors/404`);
    }

    res.render(`offers/ticket-edit`, {offer: offersResult.body, categories: categoriesResult.body});
  } catch (error) {
    next(error);
  }
};
