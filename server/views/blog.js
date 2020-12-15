const {
  getPostsByPage,
  getPostsByPageAndTag,
  getTagList,
  getPostsData,
} = require('../apis/blog_post');

const { generateTemplateLocals } = require('./utils');

const blogPostListByPage = async (req, res, next) => {
  const { page } = req.params;
  const postsReq = getPostsByPage(page);
  const tagListReq = getTagList();
  try {
    const [{ data: postsData }, { data: tagList }] = await Promise.all([
      postsReq,
      tagListReq,
    ]);
    res.render(
      'blog_list',
      generateTemplateLocals({
        postsData,
        tagList,
      }),
    );
  } catch (err) {
    next();
  }
};

const blogPostListByPageAndTag = async (req, res, next) => {
  const { page, tag } = req.params;
  const postsReq = getPostsByPageAndTag(tag, page);
  const tagListReq = getTagList();
  try {
    const [{ data: postsData }, { data: tagList }] = await Promise.all([
      postsReq,
      tagListReq,
    ]);
    res.render(
      'blog_list',
      generateTemplateLocals({
        postsData,
        tagList,
      }),
    );
  } catch (err) {
    next();
  }
};

const blogTopPageMiddleware = (req, _, next) => {
  req.params.page = 1;
  next();
};

const blogPostListByPageDefaultMiddleware = blogTopPageMiddleware;

const blogPostListByPageAndTaagDefaultMiddleware = blogTopPageMiddleware;

const blogPost = async (req, res, next) => {
  const { synonym } = req.params;
  const postReq = getPostsData(synonym);
  const tagListReq = getTagList();
  try {
    const [{ data: postData }, { data: tagList }] = await Promise.all([
      postReq,
      tagListReq,
    ]);
    res.render(
      'blog_post',
      generateTemplateLocals({
        postData,
        tagList,
      }),
    );
  } catch (err) {
    next();
  }
};

module.exports = {
  blogPostListByPage,
  blogPostListByPageAndTag,
  blogTopPageMiddleware,
  blogPostListByPageDefaultMiddleware,
  blogPostListByPageAndTaagDefaultMiddleware,
  blogPost,
};
