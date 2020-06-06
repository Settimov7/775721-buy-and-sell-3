`use strict`;

const {Router} = require(`express`);

const {HttpStatusCode} = require(`../../constants`);

const Route = {
  INDEX: `/`,
};

const createCategoryRouter = (offerService) => {
  const router = new Router();

  router.get(Route.INDEX, (req, res) => {
    const categories = offerService.findAllCategories();

    res.status(HttpStatusCode.OK).json(categories);
  });

  return router;
};

exports.createCategoryRouter = createCategoryRouter;
