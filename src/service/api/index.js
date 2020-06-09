`use strict`;

const {Router} = require(`express`);

const {createOfferRouter} = require(`./offer`);
const {createCategoryRouter} = require(`./category`);
const {createSearchRouter} = require(`./search`);
const {createCommentRouter} = require(`./comment`);

const Route = {
  OFFERS: `/offers`,
  CATEGORIES: `/categories`,
  SEARCH: `/search`,
};

const createRouter = ({offerService, commentService, categoryService}) => {
  const router = new Router();

  const commentRouter = createCommentRouter(offerService, commentService);
  const offerRouter = createOfferRouter(offerService, commentRouter);
  const categoryRouter = createCategoryRouter(offerService, categoryService);
  const searchRouter = createSearchRouter(offerService);

  router.use(Route.OFFERS, offerRouter);
  router.use(Route.CATEGORIES, categoryRouter);
  router.use(Route.SEARCH, searchRouter);

  return router;
};

exports.createRouter = createRouter;
