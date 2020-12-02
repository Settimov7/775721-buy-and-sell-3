'use strict';

const {Router} = require(`express`);

const {createOfferRouter} = require(`./offer`);
const {createCategoryRouter} = require(`./category`);
const {createSearchRouter} = require(`./search`);
const {createCommentRouter} = require(`./comment`);
const {createUserRouter} = require(`./user`);

const Route = {
  OFFERS: `/offers`,
  CATEGORIES: `/categories`,
  SEARCH: `/search`,
  USER: `/user`,
};

const createRouter = ({offerService, commentService, categoryService, userService, refreshTokenService, logger}) => {
  const router = new Router();

  const commentRouter = createCommentRouter({commentService, logger});
  const offerRouter = createOfferRouter({offerService, commentRouter, logger});
  const categoryRouter = createCategoryRouter({categoryService});
  const searchRouter = createSearchRouter({offerService, logger});
  const userRouter = createUserRouter({userService, refreshTokenService, logger});

  router.use(Route.OFFERS, offerRouter);
  router.use(Route.CATEGORIES, categoryRouter);
  router.use(Route.SEARCH, searchRouter);
  router.use(Route.USER, userRouter);

  return router;
};

exports.createRouter = createRouter;
