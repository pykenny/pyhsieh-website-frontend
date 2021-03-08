const morgan = require('morgan');
const RotatingFileStream = require('rotating-file-stream');
const { timeFormat } = require('d3-time-format');
const { isObject } = require('lodash');

const { NODE_ENV } = process.env;

const GMT_TIMESTAMP_FORMAT = '%Y%m%d-%H%M%S';
const timeFormatter = timeFormat(GMT_TIMESTAMP_FORMAT);

const createLogRotationStream = (basename, filedir, settings) => RotatingFileStream.createStream(
  (time, index) => (time !== null
    ? `${basename}-${timeFormatter(time)}-${index}.log`
    : `${basename}.log`),
  {
    path: filedir,
    ...settings,
  },
);

const createLogger = (logName, logDir, settings) => morgan(NODE_ENV === 'development' ? 'dev' : 'combined', {
  stream:
      logDir !== undefined && logName !== undefined
        ? createLogRotationStream(
          logName,
          logDir,
          isObject(settings) ? settings : {},
        )
        : undefined,
});

module.exports = createLogger;
