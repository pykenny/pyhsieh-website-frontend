#!/usr/bin/env node
const promiseFs = require('fs').promises;
const Path = require('path');

const pug = require('pug');
const rimraf = require('rimraf');

const { generateTemplateLocals } = require('../views/utils');

const TARGET_DIR_ROOT = Path.join(__dirname, '../../dist');
const TEMPLATE_EXTENSION = '.pug';
const OUTPUT_HTML_NAME = 'index.html';

function solveTarget(srcFilePath) {
  const fileName = Path.basename(srcFilePath, TEMPLATE_EXTENSION);
  const targetDir = Path.join(TARGET_DIR_ROOT, fileName);
  const targetFilePath = Path.join(targetDir, OUTPUT_HTML_NAME);

  return { targetDir, targetFilePath };
}

async function buildStaticPage(srcFile) {
  const { targetDir, targetFilePath } = solveTarget(srcFile);
  await promiseFs.mkdir(targetDir, { recursive: true });
  const rendered = pug.renderFile(
    srcFile,
    generateTemplateLocals({ filename: srcFile }),
  );
  await promiseFs.writeFile(targetFilePath, rendered);
}

async function removeStaticPage(srcFile) {
  const { targetDir } = solveTarget(srcFile);
  rimraf(targetDir);
}

module.exports = {
  buildStaticPage,
  removeStaticPage,
};
