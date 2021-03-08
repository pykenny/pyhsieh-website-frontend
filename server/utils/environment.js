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

const REQUIRED_KEYS_GENERAL = [
  'SITE_HOST',
  'BACKEND_RESOURCE_HOST',
  'IMAGE_DIR_PATH',
  'SERVER_PORT',
  'EXTERNAL_LINKS',
];

const REQUIRED_KEYS_DEV = ['SSL_KEY_PATH', 'SSL_CERT_PATH'];

function checkKeyExistence(keys, env) {
  keys.forEach((key) => {
    if (!(key in env)) {
      throw ServerEnvError(key);
    }
  });
}

function validateServerEnv(serverEnv) {
  checkKeyExistence(REQUIRED_KEYS_GENERAL, serverEnv);
  if (process.env.NODE_ENV === 'development') {
    checkKeyExistence(REQUIRED_KEYS_DEV, serverEnv);
  }
}

function initServerEnv() {
  const parseResult = dotenv.config();
  if (parseResult.error) {
    throw parseResult.error;
  }
  validateServerEnv(parseResult.parsed);
}

module.exports = initServerEnv;
