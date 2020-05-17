`use strict`;

const { Router } = require(`express`);

const router = new Router();

router.get(`/`, (req, res) => res.send(`/my`));
router.get(`/comments`, (req, res) => res.send(`/my/comments`));

module.exports = router;
