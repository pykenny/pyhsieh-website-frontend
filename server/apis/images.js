const { apiURLs, axios } = require('./utils');

async function getImageFullFilePath(fileName) {
  return axios.get(apiURLs.getImageFullFilePathURL(fileName));
}

const APIs = {
  getImageFullFilePath,
};

module.exports = APIs;
