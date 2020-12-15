const yargs = require('yargs/yargs');
const { hideBin } = require('yargs/helpers');

const parseArguments = (procArgv) => {
  const { argv: parsedArgs } = yargs(hideBin(procArgv))
    .usage('Usage: $0 [options]')
    .example([
      [
        '$0 --dev-port-script 4000 --dev-port-style 4001 --parcel-options-script "--cache-dir \\".script_dev_cache\\""',
        '>> In development mode, set up script-dev server on port 4000, '
          + 'style-dev server on port 4000, and set up ".script_dev_cache" '
          + 'as cache directory for script dev server.',
      ],
      [
        '$0 -j 4000 -c 4001 --parcel-options-script "--cache-dir \\".script_dev_cache\\""',
        '>> Apply the same settings as above.',
      ],
    ])
    .options({
      'dev-port-script': {
        alias: 'j',
        describe:
          'Port of Parcel development server for JavaScript content in development mode.'
          + 'This is not effective when running in production mode (NODE_ENV == "production").',
        type: 'number',
        nargs: 1,
        default: 3001,
      },
      'dev-port-style': {
        alias: 'c',
        describe:
          'Port of Parcel development server for CSS content in development mode.'
          + 'This is not effective when running in production mode (NODE_ENV == "production").',
        type: 'number',
        nargs: 1,
        default: 3002,
      },
      'parcel-options-script': {
        describe:
          'Additional options used to initialize parcel development server for JavaScript content.'
          + 'This is not effective when running in production mode (NODE_ENV == "production").',
        type: 'string',
        nargs: 1,
        default: '',
      },
      'parcel-options-style': {
        describe:
          'Additional options used to initialize parcel development server for CSS content.'
          + 'This is not effective when running in production mode (NODE_ENV == "production").',
        type: 'string',
        nargs: 1,
        default: '',
      },
    });

  return parsedArgs;
};

module.exports = parseArguments;
