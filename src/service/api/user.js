'use strict';

const {Router} = require(`express`);

const {isRequestDataValid} = require(`../middlewares/is-request-data-valid`);
const {isUserEmailUnique} = require(`../middlewares/is-user-email-unique`);
const {userRegisterDataSchema, userLoginDataSchema} = require(`../schema/user`);
const {HttpStatusCode} = require(`../../constants`);
const {makeTokens} = require(`../jwt/make-tokens`);

const Route = {
  INDEX: `/`,
  LOGIN: `/login`,
};

const createUserRouter = ({userService, refreshTokenService, logger}) => {
  const router = new Router();

  const isRegisterRequestDataValidMiddleware = isRequestDataValid({schema: userRegisterDataSchema, logger});
  const isLoginRequestDataValidMiddleware = isRequestDataValid({schema: userLoginDataSchema, logger});
  const isUserEmailUniqueMiddleware = isUserEmailUnique({service: userService, logger});

  router.post(Route.INDEX, [isRegisterRequestDataValidMiddleware, isUserEmailUniqueMiddleware], async (req, res, next) => {
    const {name, email, password, passwordRepeat, avatar} = req.body;

    try {
      const newUser = await userService.create({name, email, password, passwordRepeat, avatar});

      res.status(HttpStatusCode.CREATED).json(newUser);
    } catch (error) {
      next(error);
    }
  });

  router.post(Route.LOGIN, [isLoginRequestDataValidMiddleware], async (req, res, next) => {
    const {email, password} = req.body;

    try {
      const user = await userService.findByEmail(email);

      if (!user) {
        const message = `We cant find user with email: ${email}`;

        logger.error(message);

        return res.status(HttpStatusCode.FORBIDDEN).json({
          details: [
            {
              path: `email`,
              message,
            },
          ],
        });
      }

      const isPasswordIncorrect = !await userService.isUserPasswordCorrect(password, user.password);

      if (isPasswordIncorrect) {
        const message = `Wrong password`;

        logger.error(message);

        return res.status(HttpStatusCode.FORBIDDEN).json({
          details: [
            {
              path: `password`,
              message,
            },
          ],
        });
      }

      const {accessToken, refreshToken} = makeTokens({id: user.id});

      refreshTokenService.add(refreshToken);

      return res.json({
        accessToken,
        refreshToken,
      });
    } catch (error) {
      return next(error);
    }
  });

  return router;
};

exports.createUserRouter = createUserRouter;
