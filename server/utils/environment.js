const dotenv = require('dotenv');

class ServerEnvError extends Error {
  constructor(varName) {
    super(
      `Settings variable "${varName}" is required but not included in environment configure file.`,
    );
    this.name = 'ServerEnvError';
    this.varName = varName;
  }
}

const REQUIRED_KEYS = [
  'SITE_HOST',
  'BACKEND_RESOURCE_HOST',
  'IMAGE_DIR_PATH',
  'SERVER_PORT',
  'EXTERNAL_LINKS',
  'SSL_KEY_PATH',
  'SSL_CERT_PATH',
];

function validateServerEnv(serverEnv) {
  REQUIRED_KEYS.forEach((key) => {
    if (!(key in serverEnv)) {
      throw ServerEnvError(key);
    }
  });
}

function initServerEnv() {
  const parseResult = dotenv.config();
  if (parseResult.error) {
    throw parseResult.error;
  }
  validateServerEnv(parseResult.parsed);
}

module.exports = initServerEnv;
