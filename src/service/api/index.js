`use strict`;

const {Router} = require(`express`);

const {getMockData} = require(`../lib/get-mock-data`);
const {OfferService} = require(`../data-service/offer`);
const {createOfferRouter} = require(`./offer`);
const {createCategoryRouter} = require(`./category`);
const {createSearchRouter} = require(`./search`);

const Route = {
  OFFERS: `/offers`,
  CATEGORIES: `/categories`,
  SEARCH: `/search`,
};

const router = new Router();

(async () => {
  try {
    const offers = await getMockData();
    const service = new OfferService(offers);

    const offerRouter = createOfferRouter(service);
    const categoryRouter = createCategoryRouter(service);
    const searchRouter = createSearchRouter(service);

    router.use(Route.OFFERS, offerRouter);
    router.use(Route.CATEGORIES, categoryRouter);
    router.use(Route.SEARCH, searchRouter);
  } catch (error) {
    console.error(error);
  }
})();

exports.router = router;
