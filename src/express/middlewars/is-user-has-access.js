'use strict';

exports.isUserHasAccess = (req, res, next) => {
  const hasNotAccess = !res.locals.isAuthorized;

  if (hasNotAccess) {
    return res.redirect(`/login`);
  }

  return next();
};
