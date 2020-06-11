'use strict';

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

const createRouter = ({offerService, commentService, categoryService, logger}) => {
  const router = new Router();

  const commentRouter = createCommentRouter({offerService, commentService, logger});
  const offerRouter = createOfferRouter({offerService, commentRouter, logger});
  const categoryRouter = createCategoryRouter({offerService, categoryService, logger});
  const searchRouter = createSearchRouter({offerService, logger});

  router.use(Route.OFFERS, offerRouter);
  router.use(Route.CATEGORIES, categoryRouter);
  router.use(Route.SEARCH, searchRouter);

  return router;
};

exports.createRouter = createRouter;
