'use strict';

const {request} = require(`../request`);
const {readContent} = require('../../utils');
const {HttpStatusCode, ContentFilePath} = require(`../../constants`);

exports.getAddPost = async (req, res) => {
  const categories = await readContent(ContentFilePath.CATEGORIES);

  res.render(`offers/new-ticket`, { categories, action: `http://localhost:3000/api/offers/add` });
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
