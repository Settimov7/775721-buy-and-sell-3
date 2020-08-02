'use strict';

const express = require(`express`);

const {createRouter} = require(`../api`);
const {OfferService} = require(`../data-service/offer`);
const {CommentService} = require(`../data-service/comment`);
const {CategoryService} = require(`../data-service/category`);
const {pinoLogger} = require(`../logger`);
const {HttpStatusCode} = require(`../../constants`);

const Route = {
  API: `/api`,
};

const createServer = ({dataBase, logger = pinoLogger} = {}) => {
  const server = express();

  const offerService = new OfferService(dataBase, logger);
  const commentService = new CommentService();
  const categoryService = new CategoryService();

  const router = createRouter({offerService, commentService, categoryService, logger});

  server.use(express.json());

  server.use((req, res, next) => {
    logger.debug(`Start ${ req.method } request to url: ${ req.url }`);

    return next();
  });

  server.use((req, res, next) => {
    next();

    if (res.headersSent) {
      return logger.info(`End request with status code ${ res.statusCode }`);
    }

    return undefined;
  });

  server.use(Route.API, router);

  server.use((req, res) => {
    res.status(HttpStatusCode.NOT_FOUND).send(`Not found`);

    return logger.error(`Cant find route to url: ${ req.url }.`);
  });

  // eslint-disable-next-line
  server.use((error, req, res, next) => {
    res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).send(`Error`);

    return logger.error(`End request to url: ${ req.url } with error: ${ error }`);
  });

  return server;
};

exports.createServer = createServer;
