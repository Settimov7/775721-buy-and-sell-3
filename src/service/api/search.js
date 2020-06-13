'use strict';

const {Router} = require(`express`);

const {HttpStatusCode} = require(`../../constants`);

const Route = {
  INDEX: `/`,
};

const createSearchRouter = ({offerService, logger}) => {
  const router = new Router();

  router.get(Route.INDEX, (req, res) => {
    const {query} = req.query;

    if (!query) {
      res.status(HttpStatusCode.BAD_REQUEST).send(`Invalid query`);

      return logger.error(`Invalid query. End request with error: ${ res.statusCode }`);
    }

    const foundedOffers = offerService.findAllByTitle(query);

    if (!foundedOffers.length) {
      res.status(HttpStatusCode.NOT_FOUND).send(`Not found offers which includes: ${ query }`);

      return logger.error(`Not found offers which includes: ${ query }. End request with error: ${ res.statusCode }`);
    }

    return res.status(HttpStatusCode.OK).json(foundedOffers);
  });

  return router;
};

exports.createSearchRouter = createSearchRouter;
