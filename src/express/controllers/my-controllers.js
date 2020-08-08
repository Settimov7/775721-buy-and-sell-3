'use strict';

const {request} = require(`../request`);
const {API_URL} = require(`../constants`);
const {HttpStatusCode} = require(`../../constants`);

const REQUIRED_NUMBER_OF_OFFERS = 3;

exports.getMyPage = async (req, res, next) => {
  let offers = [];

  try {
    const {statusCode, body} = await request.get({url: `${ API_URL }/offers`, json: true});

    if (statusCode === HttpStatusCode.OK) {
      offers = body.offers;
    }

    res.render(`my/my-tickets`, {offers});
  } catch (error) {
    next(error);
  }
};

exports.getMyComments = async (req, res, next) => {
  try {
    const {statusCode, body} = await request.get({url: `${ API_URL }/offers`, json: true});
    const offers = statusCode === HttpStatusCode.OK ? body.offers : [];
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
