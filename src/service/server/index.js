`use strict`;

const express = require(`express`);

const {createRouter} = require(`../api`);
const {getMockData} = require('../lib/get-mock-data');
const {OfferService} = require('../data-service/offer');
const {CommentService} = require('../data-service/comment');
const {CategoryService} = require('../data-service/category');
const {HttpStatusCode} = require(`../../constants`);

const Route = {
  API: `/api`,
};

const createServer = async (offers) => {
  const server = express();
  let currentOffers = offers;

  if (!offers) {
    try {
      currentOffers = await getMockData();
    } catch (error) {
      console.error(error);
    }
  }

  const offerService = new OfferService(currentOffers);
  const commentService = new CommentService();
  const categoryService = new CategoryService();

  const router = await createRouter({offerService, commentService, categoryService});

  server.use(express.json());

  server.use(Route.API, router);

  server.use((req, res) => res.status(HttpStatusCode.NOT_FOUND).send(`Not found`));

  return server;
};

exports.createServer = createServer;
