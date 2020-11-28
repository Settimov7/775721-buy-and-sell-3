'use strict';

const {Router} = require(`express`);

const {getHomePage, getSearch, getRegister, postRegister, getLogin, postLogin, getLogout} = require(`../controllers/main-controllers`);

const router = new Router();

router.get(`/`, getHomePage);
router.get(`/register`, getRegister);
router.post(`/register`, postRegister);
router.get(`/login`, getLogin);
router.post(`/login`, postLogin);
router.get(`/logout`, getLogout);
router.get(`/search`, getSearch);

module.exports = router;
