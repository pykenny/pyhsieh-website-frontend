// Functions used in template rendering.
const Path = require('path');
const fs = require('fs');
const crypto = require('crypto');

const fastGlob = require('fast-glob');

const { SITE_HOST, NODE_ENV } = process.env;

const cipher = crypto.createHash('md5');
const globPattern = Path.join(__dirname, '../../dist/**/*.(js|css)');
fastGlob
  .sync(globPattern)
  .sort()
  .forEach((filepath) => {
    cipher.update(fs.readFileSync(filepath));
  });
const contentHash = `v=${cipher.digest('hex')}`;

// TODO: Decide whether to keep them here, or set them from other config files.
const SITE_NAME = "Layperson's Notes";

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
  createStaticScriptURL: (viewname, filename = DEFAULT_SCRIPT_NAME) => `${HOST}/static/${viewname}/${filename}?${contentHash}`,
  createStaticStyleURL: (viewname, filename = DEFAULT_STYLE_NAME) => `${HOST}/static/${viewname}/${filename}?${contentHash}`,
  createArticleListTitle: () => `${SITE_NAME}`,
  createTagArticleListTitle: (tag) => `${tag} - ${SITE_NAME}`,
  createArticleTitle: (title) => `${title} - ${SITE_NAME}`,
};

const EXTERNAL_LINKS = JSON.parse(process.env.EXTERNAL_LINKS || '{}');

const TEMPLATE_CONSTANTS = {
  siteTopURL: `${HOST}/`,
  blogTopURL: `${HOST}/blog`,
  siteName: SITE_NAME,
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
