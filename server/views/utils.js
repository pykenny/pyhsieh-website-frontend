const process = require('process');

// Functions used in template rendering.
const { SITE_HOST } = process.env;

const TEMPLATE_FUNCTIONS = {
  createNextPageURL: (page) => `${SITE_HOST}/blog/list/${page - 1}`,
  createNextTagPageURL: (page, tag) => `${SITE_HOST}/blog/list-by-tag/${tag}/${page - 1}`,
  createPrevPageURL: (page) => `${SITE_HOST}/blog/list/${page + 1}`,
  createPrevTagPageURL: (page, tag) => `${SITE_HOST}/blog/list-by-tag/${tag}/${page + 1}`,
  createTagListURL: (tag) => `${SITE_HOST}/blog/list-by-tag/${tag}`,
  createTagDefaultURL: (tag) => `${SITE_HOST}/blog/list-by-tag/${tag}`,
  createArticleURL: (synonym) => `${SITE_HOST}/blog/article/${synonym}`,
  createStaticScriptURL: (filename) => `${process.env.SIT_HOST}/dist/script/${filename}`,
  createStaticStyleURL: (filename) => `${process.env.SIT_HOST}/dist/style/${filename}`,
};

const EXTERNAL_LINKS = JSON.parse(process.env.EXTERNAL_LINKS || '{}');

const TEMPLATE_CONSTANTS = {
  siteTopURL: `${SITE_HOST}`,
  blogTopURL: `${SITE_HOST}/blog/`,
  ...EXTERNAL_LINKS,
};

const generateTemplateLocals = (data) => ({
  F: TEMPLATE_FUNCTIONS, C: TEMPLATE_CONSTANTS, ...data,
});

module.exports = {
  generateTemplateLocals,
};
