'use strict';

const {request} = require(`../request`);
const {HttpStatusCode} = require(`../../constants`);

const REQUIRED_NUMBER_OF_OFFERS = 3;

exports.getMyPage = async (req, res, next) => {
  try {
    const {statusCode, body} = await request.get({url: `http://localhost:3000/api/offers`, json: true});
    const offers = statusCode === HttpStatusCode.OK ? body : [];

    res.render(`my/my-tickets`, {offers});
  } catch (error) {
    next(error);
  }
};

exports.getMyComments = async (req, res, next) => {
  try {
    const {statusCode, body} = await request.get({url: `http://localhost:3000/api/offers`, json: true});
    const offers = statusCode === HttpStatusCode.OK ? body : [];
    const userOffers = offers.slice(0, REQUIRED_NUMBER_OF_OFFERS);

    const userOffersIds = userOffers.map(({id}) => id);
    const commentRequests = userOffersIds.map((id) => request.get({
      url: `http://localhost:3000/api/offers/${ id }/comments`,
      json: true,
    }));
    const commentResponses = await Promise.all(commentRequests);
    const userComments = commentResponses.map(({statusCode: commentsStatusCode, body: commentsBody}) => commentsStatusCode === HttpStatusCode.OK ? commentsBody : []);

    res.render(`my/comments`, {offers: userOffers, comments: userComments});
  } catch (error) {
    next(error);
  }
};
