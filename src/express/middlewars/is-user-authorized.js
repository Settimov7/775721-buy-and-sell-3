'use strict';

exports.isUserAuthorized = (req, res, next) => {
  const {isAuthorized} = res.locals;

  if (isAuthorized) {
    return res.redirect(`/`);
  }

  return next();
};
