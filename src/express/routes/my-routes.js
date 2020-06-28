'use strict';

const {Router} = require(`express`);

const {getMyPage, getMyComments} = require(`../controllers/my-controllers`);

const router = new Router();

router.get(`/`, getMyPage);
router.get(`/comments`, getMyComments);

module.exports = router;
