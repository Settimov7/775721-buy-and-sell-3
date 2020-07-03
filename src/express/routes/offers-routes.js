'use strict';

const {Router} = require(`express`);

const {getAddPost, postAddPost, getPostEdit} = require(`../controllers/offers-controllers`);

const router = new Router();

router.get(`/add`, getAddPost);
router.post(`/add`, postAddPost);
router.get(`/:id`, (req, res) => res.render(`offers/ticket`));
router.get(`/edit/:id`, getPostEdit);
router.get(`/category/:id`, (req, res) => res.render(`offers/category`));

module.exports = router;
