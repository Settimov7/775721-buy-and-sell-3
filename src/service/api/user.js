'use strict';

const {Router} = require(`express`);
const jwt = require(`jsonwebtoken`);

const {isRequestDataValid} = require(`../middlewares/is-request-data-valid`);
const {isUserEmailUnique} = require(`../middlewares/is-user-email-unique`);
const {userRegisterDataSchema, userLoginDataSchema} = require(`../schema/user`);
const {HttpStatusCode} = require(`../../constants`);
const {JWT_REFRESH_SECRET} = require(`../../config`);
const {makeTokens} = require(`../jwt/make-tokens`);

const Route = {
  INDEX: `/`,
  LOGIN: `/login`,
  REFRESH: `/refresh`,
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

  router.post(Route.REFRESH, async (req, res, next) => {
    const {token} = req.body;

    try {
      const refreshToken = await refreshTokenService.findByValue(token);

      if (!refreshToken) {
        return res.sendStatus(HttpStatusCode.NOT_FOUND);
      }

      jwt.verify(token, JWT_REFRESH_SECRET, async (error, {id}) => {
        if (error) {
          return res.sendStatus(HttpStatusCode.FORBIDDEN);
        }

        const newTokens = makeTokens({id});

        await refreshTokenService.delete(token);
        await refreshTokenService.add(newTokens.refreshToken);

        return res.json(newTokens);
      });
    } catch (error) {
      return next(error);
    }

    return null;
  });

  return router;
};

exports.createUserRouter = createUserRouter;
