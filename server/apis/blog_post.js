const { apiURLs, axios } = require('./utils');

async function getPostsByPage(page) {
  return axios.get(apiURLs.getPostsByPageURL(page));
}

async function getPostsByPageAndTag(tag, page) {
  return axios.get(apiURLs.getPostsByPageAndTagURL(tag, page));
}

async function getPostsData(synonym) {
  return axios.get(apiURLs.getPostsDataURL(synonym));
}

async function getTagList() {
  return axios.get(apiURLs.getTagListURL());
}

const APIs = {
  getPostsByPage,
  getPostsByPageAndTag,
  getPostsData,
  getTagList,
};

module.exports = APIs;
