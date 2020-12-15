#!/usr/bin/env node
const promiseFs = require('fs').promises;
const Path = require('path');
const pug = require('pug');

const initServerEnv = require('../server/utils/environment');
const { generateTemplateLocals } = require('../server/views/utils');

initServerEnv();

const SOURCE_TEMPLATES_DIR = Path.join(__dirname, '../src/views');
const SOURCE_TEMPLATES_NAME = ['site_top'];

const TARGET_DIR_ROOT = Path.join(__dirname, '../dist');
const OUTPUT_HTML_NAME = 'index.html';

/* TODOs:
 * 1. Build directory for TARGET_DIR
 * 2. Render the content, then export to TARGET_DIR
 *    => TARGET_DIR/filename/index.html
 */

async function run() {
  SOURCE_TEMPLATES_NAME.forEach(async (filename) => {
    const fileFullPath = Path.join(SOURCE_TEMPLATES_DIR, `${filename}.pug`);
    const targetDir = Path.join(TARGET_DIR_ROOT, filename);
    const targetPath = Path.join(targetDir, OUTPUT_HTML_NAME);
    await promiseFs.mkdir(targetDir, { recursive: true });
    process.stdout.write(`Processing templte ${filename}...\n`);
    const rendered = pug.renderFile(
      fileFullPath,
      generateTemplateLocals({ filename: fileFullPath }),
    );
    try {
      await promiseFs.writeFile(targetPath, rendered);
    } catch (error) {
      process.stderr.write(`Error on processing template:\n${error}`);
    }
  });
}

run();