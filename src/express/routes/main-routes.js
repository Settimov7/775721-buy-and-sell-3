`use strict`;

const { Router } = require(`express`);

const router = new Router();

router.get(`/`, (req, res) => res.render(`main/main`));
router.get(`/register`, (req, res) => res.render(`main/sign-up`));
router.get(`/login`, (req, res) => res.render(`main/login`));
router.get(`/search`, (req, res) => res.render(`main/search-result`));

module.exports = router;
