'use strict';

const express = require(`express`);

const {createRouter} = require(`../api`);
const {getMockData} = require(`../lib/get-mock-data`);
const {OfferService} = require(`../data-service/offer`);
const {CommentService} = require(`../data-service/comment`);
const {CategoryService} = require(`../data-service/category`);
const {pinoLogger} = require(`../logger`);
const {HttpStatusCode} = require(`../../constants`);

const Route = {
  API: `/api`,
};

const createServer = async ({offers, logger = pinoLogger} = {}) => {
  const server = express();
  let currentOffers = offers;

  if (!offers) {
    try {
      currentOffers = await getMockData();
    } catch (error) {
      logger.error(`Can't get mock offers. Error: ${ error }`);
    }
  }

  const offerService = new OfferService(currentOffers);
  const commentService = new CommentService();
  const categoryService = new CategoryService();

  const router = await createRouter({offerService, commentService, categoryService, logger});

  server.use((req, res, next) => {
    logger.debug(`Start request to url: ${ req.url }`);

    return next();
  });

  server.use(express.json());

  server.use(Route.API, router);

  server.use((req, res) => {

    res.status(HttpStatusCode.NOT_FOUND).send(`Not found`);

    return logger.error(`Cant find route to url: ${ req.url }. End request with error: ${ res.statusCode }`);
  });

  return server;
};

exports.createServer = createServer;
