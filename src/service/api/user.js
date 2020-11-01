'use strict';

const {Router} = require(`express`);

const {isRequestDataValid} = require(`../middlewares/is-request-data-valid`);
const {isUserEmailUnique} = require(`../middlewares/is-user-email-unique`);
const {userDataSchema} = require(`../schema/user`);
const {HttpStatusCode} = require(`../../constants`);

const Route = {
  INDEX: `/`,
};

const createUserRouter = ({userService, logger}) => {
  const router = new Router();

  const isRequestDataValidMiddleware = isRequestDataValid({schema: userDataSchema, logger});
  const isUserEmailUniqueMiddleware = isUserEmailUnique({service: userService, logger});

  router.post(Route.INDEX, [isRequestDataValidMiddleware, isUserEmailUniqueMiddleware], async (req, res, next) => {
    const {name, email, password, passwordRepeat, avatar} = req.body;

    try {
      const newUser = await userService.create({name, email, password, passwordRepeat, avatar});

      res.status(HttpStatusCode.CREATED).json(newUser);
    } catch (error) {
      next(error);
    }
  });

  return router;
};

exports.createUserRouter = createUserRouter;
