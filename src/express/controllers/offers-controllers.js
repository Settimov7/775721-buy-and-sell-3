'use strict';

const {request} = require(`../request`);
const {readContent} = require(`../../utils`);
const {HttpStatusCode, ContentFilePath} = require(`../../constants`);

exports.getAddPost = async (req, res) => {
  const categories = await readContent(ContentFilePath.CATEGORIES);

  res.render(`offers/new-ticket`, {categories, action: `http://localhost:8080/offers/add`});
};

exports.postAddPost = async (req, res) => {
  const categories = await readContent(ContentFilePath.CATEGORIES);
  const {avatar, title, description, category, sum, type} = req.body;

  const offerCategories = Array.isArray(category) ? category.map((index) => categories[index - 1]) : categories[category - 1];

  const offer = {
    title,
    type,
    category: offerCategories,
    description,
    picture: avatar,
    sum,
  };

  const {statusCode} = await request.post({url: `http://localhost:3000/api/offers`, json: true, body: offer});

  if (statusCode === HttpStatusCode.CREATED) {
    return res.redirect(`/my`);
  }

  return res.render(`offers/new-ticket`, {categories, action: `http://localhost:8080/offers/add`, offer});
};

exports.getPostEdit = async (req, res) => {
  const {id} = req.params;
  const {statusCode, body} = await request.get({url: `http://localhost:3000/api/offers/${ id }`, json: true});

  if (statusCode === HttpStatusCode.NOT_FOUND) {
    res.status(HttpStatusCode.NOT_FOUND).render(`errors/404`);
  }

  const categories = await readContent(ContentFilePath.CATEGORIES);

  res.render(`offers/ticket-edit`, {offer: body, categories});
};
