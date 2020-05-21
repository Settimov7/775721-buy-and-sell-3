`use strict`;

const { Router } = require(`express`);

const router = new Router();

router.get(`/`, (req, res) => res.render(`my/my-tickets`));
router.get(`/comments`, (req, res) => res.render(`my/comments`));

module.exports = router;
