`use strict`;

const { Router } = require(`express`);

const router = new Router();

router.get(`/`, (req, res) => res.send(`/`))
router.get(`/register`, (req, res) => res.send(`/register`));
router.get(`/login`, (req, res) => res.send(`/login`));
router.get(`/search`, (req, res) => res.send(`/search`));

module.exports = router;
