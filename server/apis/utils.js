const axiosLib = require('axios');
const applyCaseMiddleware = require('axios-case-converter').default;

// URL Management
const { BACKEND_RESOURCE_HOST } = process.env;
const RESOURCE_MANAGEMENT_ROUTE = `${BACKEND_RESOURCE_HOST}/resource`;

function getPostsByPageURL(page) {
  return `${RESOURCE_MANAGEMENT_ROUTE}/posts_by_page/${page}`;
}

function getPostsByPageAndTagURL(tag, page) {
  return `${RESOURCE_MANAGEMENT_ROUTE}/posts_by_page_and_tag/${tag}/${page}`;
}

function getPostsDataURL(synonym) {
  return `${RESOURCE_MANAGEMENT_ROUTE}/get_post_data/${synonym}`;
}

function getTagListURL() {
  return `${RESOURCE_MANAGEMENT_ROUTE}/get_tag_list/`;
}

function getImageFullFilePathURL(fileName) {
  return `${RESOURCE_MANAGEMENT_ROUTE}/get_full_file_path/${fileName}`;
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
