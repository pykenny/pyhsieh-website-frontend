const Path = require('path');

const mainPage = async (_, res, next) => {
  try {
    res.sendFile(Path.join(Path.join(__dirname, '/index.html')));
  } catch (error) {
    next();
  }
};

module.exports = {
  mainPage,
};
