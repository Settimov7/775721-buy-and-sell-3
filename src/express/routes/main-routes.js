'use strict';

const {Router} = require(`express`);

const {getHomePage, getSearch} = require('../controllers/main-controllers');

const router = new Router();

router.get(`/`, getHomePage);
router.get(`/register`, (req, res) => res.render(`main/sign-up`));
router.get(`/login`, (req, res) => res.render(`main/login`));
router.get(`/search`, getSearch);

module.exports = router;
