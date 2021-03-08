const { Router } = require('express');

const {
  blogPostListByPage,
  blogPostListByPageAndTag,
  blogTopPageMiddleware,
  blogPostListByPageDefaultMiddleware,
  blogPostListByPageAndTaagDefaultMiddleware,
  blogPost,
} = require('../views/blog');

const router = Router();

router.get('/', blogTopPageMiddleware, blogPostListByPage);
router.get('/list', blogPostListByPageDefaultMiddleware, blogPostListByPage);
router.get('/list/:page([1-9][0-9]{0,})', blogPostListByPage);
router.get(
  '/list-by-tag/:tag',
  blogPostListByPageAndTaagDefaultMiddleware,
  blogPostListByPageAndTag,
);
router.get(
  '/list-by-tag/:tag/:page([1-9][0-9]{0,})/',
  blogPostListByPageAndTag,
);
router.get('/article/:synonym', blogPost);

module.exports = router;
