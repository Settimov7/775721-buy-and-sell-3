'use strict';

const {Router} = require(`express`);

const {HttpStatusCode} = require(`../../constants`);

const Route = {
  INDEX: `/`,
};

const createCategoryRouter = ({offerService, categoryService, logger}) => {
  const router = new Router();

  router.get(Route.INDEX, (req, res) => {
    const offers = offerService.findAll();
    const categories = categoryService.findAll(offers);

    res.status(HttpStatusCode.OK).json(categories);

    return logger.info(`End request with status code ${ res.statusCode }`);
  });

  return router;
};

exports.createCategoryRouter = createCategoryRouter;
