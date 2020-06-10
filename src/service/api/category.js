'use strict';

const {Router} = require(`express`);

const {HttpStatusCode} = require(`../../constants`);

const Route = {
  INDEX: `/`,
};

const createCategoryRouter = (offerService, categoryService) => {
  const router = new Router();

  router.get(Route.INDEX, (req, res) => {
    const offers = offerService.findAll();
    const categories = categoryService.findAll(offers);

    res.status(HttpStatusCode.OK).json(categories);
  });

  return router;
};

exports.createCategoryRouter = createCategoryRouter;
