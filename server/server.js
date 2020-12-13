#!/usr/bin/env node
const initServerEnv = require('./utils/environment');
const parseArgument = require('./utils/arguments');
const run = require('./utils/main');

initServerEnv();
run(parseArgument(process.argv));
