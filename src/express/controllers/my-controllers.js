'use strict';

const {request} = require(`../request`);
const {HttpStatusCode} = require(`../../constants`);

exports.getMyPage = async (req, res) => {
  const {statusCode, body} = await request.get({url: `http://localhost:3000/api/offers`, json: true});
  const offers = statusCode === HttpStatusCode.OK ? body: [];

  res.render(`my/my-tickets`, { offers });
};
