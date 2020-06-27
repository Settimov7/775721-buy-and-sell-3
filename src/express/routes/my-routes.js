'use strict';

const {Router} = require(`express`);

const {getMyPage} = require(`../controllers/my-controllers`);

const router = new Router();

router.get(`/`, getMyPage);
router.get(`/comments`, (req, res) => res.render(`my/comments`));

module.exports = router;
