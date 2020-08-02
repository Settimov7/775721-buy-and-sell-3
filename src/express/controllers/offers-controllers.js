'use strict';

const {request} = require(`../request`);
const {readContent} = require(`../../utils`);
const {API_URL} = require(`../constants`);
const {HttpStatusCode, ContentFilePath} = require(`../../constants`);

exports.getAddPost = async (req, res, next) => {
  try {
    // TODO: Загружать данные из базы
    const categories = await readContent(ContentFilePath.CATEGORIES);

    res.render(`offers/new-ticket`, {categories});
  } catch (error) {
    next(error);
  }
};

exports.postAddPost = async (req, res, next) => {
  try {
    // TODO: Загружать данные из базы
    const categories = await readContent(ContentFilePath.CATEGORIES);
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

    return res.render(`offers/new-ticket`, {categories, action: `http://localhost:8080/offers/add`, offer});
  } catch (error) {
    return next(error);
  }
};

exports.getPostEdit = async (req, res, next) => {
  try {
    const {id} = req.params;
    const {statusCode, body} = await request.get({url: `${ API_URL }/offers/${ id }`, json: true});

    if (statusCode === HttpStatusCode.NOT_FOUND) {
      res.status(HttpStatusCode.NOT_FOUND).render(`errors/404`);
    }

    const categories = await readContent(ContentFilePath.CATEGORIES);

    res.render(`offers/ticket-edit`, {offer: body, categories});
  } catch (error) {
    next(error);
  }
};
