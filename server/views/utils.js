// Functions used in template rendering.
const { SITE_HOST, NODE_ENV } = process.env;
const DEFAULT_SCRIPT_NAME = 'index.js';
const DEFAULT_STYLE_NAME = 'style.css';
const HOST = NODE_ENV === 'development' ? SITE_HOST : SITE_HOST || '';
const TEMPLATE_FUNCTIONS = {
  createNextPageURL: (page) => `${HOST}/blog/list/${page - 1}`,
  createNextTagPageURL: (page, tag) => `${HOST}/blog/list-by-tag/${tag}/${page - 1}`,
  createPrevPageURL: (page) => `${HOST}/blog/list/${page + 1}`,
  createPrevTagPageURL: (page, tag) => `${HOST}/blog/list-by-tag/${tag}/${page + 1}`,
  createTagListURL: (tag) => `${HOST}/blog/list-by-tag/${tag}`,
  createTagDefaultURL: (tag) => `${HOST}/blog/list-by-tag/${tag}`,
  createArticleURL: (synonym) => `${HOST}/blog/article/${synonym}`,
  createStaticScriptURL: (viewname, filename = DEFAULT_SCRIPT_NAME) => `${HOST}/static/${viewname}/${filename}`,
  createStaticStyleURL: (viewname, filename = DEFAULT_STYLE_NAME) => `${HOST}/static/${viewname}/${filename}`,
};

const EXTERNAL_LINKS = JSON.parse(process.env.EXTERNAL_LINKS || '{}');

const TEMPLATE_CONSTANTS = {
  siteTopURL: `${HOST}/`,
  blogTopURL: `${HOST}/blog`,
  ...EXTERNAL_LINKS,
};

const generateTemplateLocals = (data) => ({
  F: TEMPLATE_FUNCTIONS,
  C: TEMPLATE_CONSTANTS,
  ...data,
});

module.exports = {
  generateTemplateLocals,
};