const { Router } = require('express');

const { blogPostListByPage, blogTopPageMiddleware } = require('../views/blog');

const router = Router();

// Direct to blog top for now
router.get('/', blogTopPageMiddleware, blogPostListByPage);

module.exports = router;
