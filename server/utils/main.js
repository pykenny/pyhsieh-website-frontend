const Path = require('path');
const process = require('process');
const promiseFs = require('fs').promises;
const { exec } = require('child_process');
const { stdout } = require('process');

const chokidar = require('chokidar');
const express = require('express');
const helmet = require('helmet');
const { createProxyMiddleware } = require('http-proxy-middleware');

const routerMain = require('../routes/main');
const routerBlog = require('../routes/blog');

/* File paths used in dev mode */
const VIEW_GLOB_SRC = Path.join(__filename, '../../src/views/*.pug');
const VIEW_GLOB_TGT_DIR = Path.join(__filename, '../../dist/views/');
const SCRIPT_TARGET_GLOB = Path.join(__filename, '../../src/js/site/*/index.jsx');
const STYLE_TARGET_GLOB = Path.join(__filename, '../../src/scss/site/*/style.scss');
/* File paths used in prod mode */
const PROD_STATIC_PATH = Path.join(__filename, '../../dist');

/* Routes for static files */
const STATIC_ROOT_ROUTE = '/static';
const SCRIPTS_EXTS = ['js'];
const STYLES_EXTS = ['css'];
const SHARED_ASSET_EXTS = ['ttf', 'eot'];
const STATIC_ROUTE_SCRIPT = `${STATIC_ROOT_ROUTE}/:view/[^/]+.(${SCRIPTS_EXTS.join('|')})(.map)?`;
const STATIC_ROUTE_STYLE = `${STATIC_ROOT_ROUTE}/:view/[^/]+.(${STYLES_EXTS.join('|')})(.map)?`;
const STATIC_ROUTE_SHARED_ASSET = `${STATIC_ROOT_ROUTE}/[^/]+.(${SHARED_ASSET_EXTS.join('|')})`;
const IMG_ROOT_ROUTE = '/img';

const run = (argv) => {
  const devMode = process.env.NODE_ENV === 'development';
  const devPortScript = devMode ? parseInt(argv['dev-port-script'], 10) : undefined;
  const devPortStyle = devMode ? parseInt(argv['dev-port-style'], 10) : undefined;
  const parcelOptionsScript = devMode ? argv['parcel-options-script'] : undefined;
  const parcelOptionsStyle = devMode ? argv['parcel-options-style'] : undefined;
  const {
    // SITE_HOST: siteHost,
    // BACKEND_RESOURCE_HOST: backendResourceHost,
    IMAGE_DIR_PATH: imageDirPath,
    SERVER_PORT: serverPort,
  } = process.env;

  let parcelServerScript;
  let parcelServerStyle;
  let parcelScriptMiddleware;
  let parcelStyleMiddleware;
  let templateWatcher;

  if (devMode) {
    process.env.FORCE_COLOR = 2; // Enable color tts
    parcelServerScript = exec(
      `npx parcel "${SCRIPT_TARGET_GLOB}" --no-cache --port ${devPortScript} --public-url ${STATIC_ROOT_ROUTE} ${parcelOptionsScript} ${SCRIPT_TARGET_GLOB}`,
      {},
      (error) => {
        if (error) {
          process.stdout.write('Parcel dev-script server terminated with error:\n');
          process.stdout.write(error);
        }
        process.stdout.write('Parcel dev-script server terminated successfully.\n');
      },
    );
    parcelServerStyle = exec(
      `npx parcel "${STYLE_TARGET_GLOB}" --no-cache --port ${devPortStyle} --public-url ${STATIC_ROOT_ROUTE} ${parcelOptionsStyle} ${STYLE_TARGET_GLOB}`,
      {},
      (error) => {
        if (error) {
          process.stdout.write('Parcel dev-script server terminated with error:\n');
          process.stdout.write(error);
        }
        process.stdout.write('Parcel dev-style server terminated successfully.\n');
      },
    );

    parcelServerScript.stdout.pipe(process.stdout);
    parcelServerScript.stderr.pipe(process.stderr);
    parcelServerStyle.stdout.pipe(process.stdout);
    parcelServerStyle.stderr.pipe(process.stderr);

    parcelScriptMiddleware = createProxyMiddleware({
      target: `localhost:${devPortScript}`,
    });
    parcelStyleMiddleware = createProxyMiddleware({
      target: `localhost:${devPortStyle}`,
    });

    /*
     * Chokidar will automatically trigger 'add' event on initial search, so
     * it will run initial sync for us!
     * Currently we'll just take a lazy approach and omit all file system
     * errors occur on cp/unlink operations.
     */
    templateWatcher = chokidar.watch(VIEW_GLOB_SRC);
    templateWatcher.on('add', (filePath) => {
      const targetPath = Path.join(
        VIEW_GLOB_TGT_DIR, Path.basename(filePath),
      );
      stdout.write(`New template file "${filePath}" found. Syncing to dist directory...`);
      promiseFs.copyFile(filePath, targetPath).catch(() => {});
    });
    templateWatcher.on('change', (filePath) => {
      const targetPath = Path.join(
        VIEW_GLOB_TGT_DIR, Path.basename(filePath),
      );
      stdout.write(`Detect change template file "${filePath}". Syncing to dist directory...`);
      promiseFs.copyFile(filePath, targetPath).catch(() => {});
    });
    templateWatcher.on('unlink', (filePath) => {
      const targetPath = Path.join(
        VIEW_GLOB_TGT_DIR, Path.basename(filePath),
      );
      stdout.write(`Detect removal of template file "${filePath}". Syncing to dist directory...`);
      promiseFs.unlink(targetPath).catch(() => {});
    });
  }

  const server = express();
  // Views
  server.set('views', VIEW_GLOB_TGT_DIR);
  server.set('view engine', 'pug');
  // Security headers
  server.use(helmet());
  // JSON / URL support
  server.use(express.json());
  server.use(express.urlencoded({ extended: true }));

  if (devMode) {
    server.use(STATIC_ROUTE_SCRIPT, parcelScriptMiddleware);
    server.use(STATIC_ROUTE_STYLE, parcelStyleMiddleware);
    // Note: Right now only CSS file uses shared assets.
    server.use(STATIC_ROUTE_SHARED_ASSET, parcelStyleMiddleware);
  } else {
    server.use(STATIC_ROOT_ROUTE, express.static(PROD_STATIC_PATH));
  }

  server.use(IMG_ROOT_ROUTE, express.static(imageDirPath));

  // Routers
  server.get('/', routerMain);
  server.get('/blog', routerBlog);

  const serverHandle = server.listen(serverPort, () => {
    process.stdout.write(`Listening to port ${serverPort}...\n`);
  });

  process.on('SIGINT', () => {
    serverHandle.close(() => {
      if (parcelServerScript !== undefined) {
        process.stdout.write('Terminating Parcel dev-script server...\n');
        parcelServerScript.kill('SIGINT');
      }
      if (parcelServerStyle !== undefined) {
        process.stdout.write('Terminating Parcel dev-style server...\n');
        parcelServerStyle.kill('SIGINT');
      }
      if (templateWatcher !== undefined) {
        process.stdout.write('Terminating template watcher...\n');
        templateWatcher.close();
      }
    });
  });
};

module.exports = run;
