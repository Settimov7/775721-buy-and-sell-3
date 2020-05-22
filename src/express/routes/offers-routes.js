`use strict`;

const { Router } = require(`express`);

const router = new Router();

router.get(`/add`, (req, res) => res.render(`offers/new-ticket`));
router.get(`/:id`, (req, res) => res.render(`offers/ticket`));
router.get(`/edit/:id`, (req, res) => res.render(`offers/ticket-edit`));
router.get(`/category/:id`, (req, res) => res.render(`offers/category`));

module.exports = router;
