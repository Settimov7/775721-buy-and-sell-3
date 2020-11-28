'use strict';

const {request} = require(`../request`);
const {HttpStatusCode} = require(`../../constants`);
const {API_URL} = require(`../../config`);

exports.getAddPost = async (req, res, next) => {
  try {
    const {statusCode, body: categories} = await request.get({url: `${ API_URL }/categories`, json: true});

    if (statusCode === HttpStatusCode.NOT_FOUND) {
      return res.status(HttpStatusCode.NOT_FOUND).render(`errors/404`);
    }

    return res.render(`offers/new-ticket`, {categories});
  } catch (error) {
    return next(error);
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

    const {statusCode, body} = await request.post({url: `${ API_URL }/offers`, json: true, body: offer});

    if (statusCode === HttpStatusCode.CREATED) {
      return res.redirect(`/my`);
    }

    const validationErrors = body.details.map(({message}) => message);

    const categoriesResult = await request.get({url: `${ API_URL }/categories`, json: true});

    if (categoriesResult.statusCode === HttpStatusCode.NOT_FOUND) {
      return res.status(HttpStatusCode.NOT_FOUND).render(`errors/404`);
    }

    return res.render(`offers/new-ticket`, {
      categories: categoriesResult.body,
      action: `http://localhost:8080/offers/add`,
      offer,
      errors: validationErrors,
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
      return res.status(HttpStatusCode.NOT_FOUND).render(`errors/404`);
    }

    const categoriesResult = await request.get({url: `${ API_URL }/categories`, json: true});

    if (categoriesResult.statusCode === HttpStatusCode.NOT_FOUND) {
      return res.status(HttpStatusCode.NOT_FOUND).render(`errors/404`);
    }

    return res.render(`offers/ticket-edit`, {offer: offersResult.body, categories: categoriesResult.body});
  } catch (error) {
    return next(error);
  }
};
