#!/usr/bin/env node

require('./utils/environment')();
const parseArgument = require('./utils/arguments');
const run = require('./utils/main');

run(parseArgument(process.argv));
