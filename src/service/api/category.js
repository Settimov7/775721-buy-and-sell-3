`use strict`;

const {Router} = require(`express`);

const {HttpStatusCode} = require(`../../constants`);

const Route = {
  INDEX: `/`,
};

const createCategoryRouter = (service) => {
  const router = new Router();

  router.get(Route.INDEX, (req, res) => {
    const categories = service.findAllCategories();

    res.status(HttpStatusCode.OK).json(categories);
  });

  return router;
};

exports.createCategoryRouter = createCategoryRouter;
