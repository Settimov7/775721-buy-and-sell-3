'use strict';

const {Router} = require(`express`);

const {getAddPost, postAddPost, getPostEdit} = require(`../controllers/offers-controllers`);
const {isUserHasAccess} = require(`../middlewars/is-user-has-access`);

const router = new Router();

router.get(`/add`, [isUserHasAccess], getAddPost);
router.post(`/add`, [isUserHasAccess], postAddPost);
router.get(`/:id`, (req, res) => res.render(`offers/ticket`));
router.get(`/edit/:id`, [isUserHasAccess], getPostEdit);
router.get(`/category/:id`, (req, res) => res.render(`offers/category`));

module.exports = router;
