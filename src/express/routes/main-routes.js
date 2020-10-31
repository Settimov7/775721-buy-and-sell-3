'use strict';

const {Router} = require(`express`);

const {getHomePage, getSearch, getRegister, postRegister} = require(`../controllers/main-controllers`);

const router = new Router();

router.get(`/`, getHomePage);
router.get(`/register`, getRegister);
router.post(`/register`, postRegister);
router.get(`/login`, (req, res) => res.render(`main/login`));
router.get(`/search`, getSearch);

module.exports = router;
