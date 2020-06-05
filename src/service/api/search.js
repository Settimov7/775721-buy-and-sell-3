`use strict`;

const {Router} = require(`express`);

const {HttpStatusCode} = require(`../../constants`);

const Route = {
  INDEX: `/`,
};

const createSearchRouter = (service) => {
  const router = new Router();

  router.get(Route.INDEX, (req, res) => {
    const {query} = req.query;

    if (!query) {
      return res.status(HttpStatusCode.BAD_REQUEST).send(`Invalid query`);
    }

    const foundedOffers = service.findAllByTitle(query);

    if (!foundedOffers.length) {
      return res.status(HttpStatusCode.NOT_FOUND).send(`Not found offers which includes: ${ query }`);
    }

    res.status(HttpStatusCode.OK).json(foundedOffers);
  });

  return router;
};

exports.createSearchRouter = createSearchRouter;
