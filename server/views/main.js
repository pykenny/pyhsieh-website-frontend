const Path = require('path');

const mainPage = async (_, res, next) => {
  try {
    res.sendFile(Path.join(__dirname, '../../dist/site_top/index.html'));
  } catch (error) {
    next();
  }
};

module.exports = {
  mainPage,
};
