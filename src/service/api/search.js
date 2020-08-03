'use strict';

const {Router} = require(`express`);

const {HttpStatusCode} = require(`../../constants`);

const Route = {
  INDEX: `/`,
};

const createSearchRouter = ({offerService, logger}) => {
  const router = new Router();

  router.get(Route.INDEX, async (req, res, next) => {
    const decodedQuery = decodeURI(req.query.query);

    if (!decodedQuery) {
      res.status(HttpStatusCode.BAD_REQUEST).send(`Invalid query`);
      return logger.error(`Invalid query.`);
    }

    try {
      const foundedOffers = await offerService.findAllByTitle(decodedQuery);

      if (!foundedOffers.length) {
        res.status(HttpStatusCode.NOT_FOUND).send(`Not found offers which includes: ${ decodedQuery }`);
        return logger.error(`Not found offers which includes: ${ decodedQuery }.`);
      }

      return res.status(HttpStatusCode.OK).json(foundedOffers);
    } catch (error) {
      next(error);
    }

    return null;
  });

  return router;
};

exports.createSearchRouter = createSearchRouter;
