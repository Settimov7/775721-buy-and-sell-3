`use strict`;

const {Router} = require(`express`);

const {getMockData} = require(`../lib/get-mock-data`);
const {OfferService} = require(`../data-service/offer`);
const {CommentService} = require(`../data-service/comment`);
const {CategoryService} = require(`../data-service/category`);
const {createOfferRouter} = require(`./offer`);
const {createCategoryRouter} = require(`./category`);
const {createSearchRouter} = require(`./search`);
const {createCommentRouter} = require(`./comment`);

const Route = {
  OFFERS: `/offers`,
  CATEGORIES: `/categories`,
  SEARCH: `/search`,
};

const router = new Router();

(async () => {
  try {
    const offers = await getMockData();

    const offerService = new OfferService(offers);
    const commentService = new CommentService();
    const categoryService = new CategoryService();

    const commentRouter = createCommentRouter(offerService, commentService);
    const offerRouter = createOfferRouter(offerService, commentRouter);
    const categoryRouter = createCategoryRouter(offerService, categoryService);
    const searchRouter = createSearchRouter(offerService);

    router.use(Route.OFFERS, offerRouter);
    router.use(Route.CATEGORIES, categoryRouter);
    router.use(Route.SEARCH, searchRouter);
  } catch (error) {
    console.error(error);
  }
})();

exports.router = router;
