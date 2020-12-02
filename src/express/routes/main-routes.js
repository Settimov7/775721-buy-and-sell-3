'use strict';

const {Router} = require(`express`);

const {getHomePage, getSearch, getRegister, postRegister, getLogin, postLogin, getLogout} = require(`../controllers/main-controllers`);
const {isUserHasAccess} = require(`../middlewars/is-user-has-access`);
const {isUserAuthorized} = require(`../middlewars/is-user-authorized`);

const router = new Router();

router.get(`/`, getHomePage);
router.get(`/register`, [isUserAuthorized], getRegister);
router.post(`/register`, [isUserAuthorized], postRegister);
router.get(`/login`, [isUserAuthorized], getLogin);
router.post(`/login`, [isUserAuthorized], postLogin);
router.get(`/logout`, [isUserHasAccess], getLogout);
router.get(`/search`, getSearch);

module.exports = router;
