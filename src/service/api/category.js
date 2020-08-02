'use strict';

const {Router} = require(`express`);

const {HttpStatusCode} = require(`../../constants`);

const Route = {
  INDEX: `/`,
};

const createCategoryRouter = ({categoryService}) => {
  const router = new Router();

  router.get(Route.INDEX, async (req, res, next) => {
    try {
      const categories = await categoryService.findAll();

      res.status(HttpStatusCode.OK).json(categories);
    } catch (error) {
      next(error);
    }
  });

  return router;
};

exports.createCategoryRouter = createCategoryRouter;
