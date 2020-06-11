'use strict';

const {Router} = require(`express`);

const {HttpStatusCode} = require(`../../constants`);

const Route = {
  INDEX: `/`,
};

const createCategoryRouter = ({offerService, categoryService}) => {
  const router = new Router();

  router.get(Route.INDEX, (req, res, next) => {
    const offers = offerService.findAll();
    const categories = categoryService.findAll(offers);

    res.status(HttpStatusCode.OK).json(categories);

    next();
  });

  return router;
};

exports.createCategoryRouter = createCategoryRouter;
