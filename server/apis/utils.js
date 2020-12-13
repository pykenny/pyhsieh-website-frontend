const axiosLib = require('axios');
const applyCaseMiddleware = require('axios-case-converter');

// URL Management
const RESOURCE_MANAGEMENT_HOST = process.env.SITE_HOST;

function getPostsByPageURL(page) {
  return `${RESOURCE_MANAGEMENT_HOST}/posts_by_page/${page}`;
}

function getPostsByPageAndTagURL(tag, page) {
  return `${RESOURCE_MANAGEMENT_HOST}/posts_by_page_and_tag/${tag}/${page}`;
}

function getPostsDataURL(synonym) {
  return `${RESOURCE_MANAGEMENT_HOST}/get_post_data/${synonym}`;
}

function getTagListURL() {
  return `${RESOURCE_MANAGEMENT_HOST}/get_tag_list/`;
}

function getImageFullFilePathURL(fileName) {
  return `${RESOURCE_MANAGEMENT_HOST}/get_full_file_path/${fileName}`;
}

const apiURLs = {
  getPostsByPageURL,
  getPostsByPageAndTagURL,
  getPostsDataURL,
  getTagListURL,
  getImageFullFilePathURL,
};

// Customized axios instance
const axios = applyCaseMiddleware(axiosLib.create());

module.exports = {
  apiURLs,
  axios,
};
