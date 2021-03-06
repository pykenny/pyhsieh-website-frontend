const Path = require('path');
const fs = require('fs');
const promiseFs = require('fs').promises;
const { exec } = require('child_process');
const { stdout, stderr } = require('process');
const https = require('https');

const chokidar = require('chokidar');
const express = require('express');
const bodyParser = require('body-parser');

const favicon = require('serve-favicon');
const errorHandler = require('errorhandler');
const helmet = require('helmet');
const { createProxyMiddleware } = require('http-proxy-middleware');

const routerMain = require('../routes/main');
const routerBlog = require('../routes/blog');
const routerError = require('../routes/error');
const { buildStaticPage, removeStaticPage } = require('./static_pages');
const createLogger = require('./logging');

/* File paths used in dev mode */
const VIEW_TEMPLATE_GLOB_SRC = Path.join(
  __dirname,
  '../../src/views/template/*.pug',
);
const VIEW_TEMPLATE_GLOB_TGT_DIR = Path.join(__dirname, '../../dist/views/');
const VIEW_STATIC_PAGE_GLOB_SRC = Path.join(
  __dirname,
  '../../src/views/static/*.pug',
);
const VIEW_STATIC_PAGE_GLOB_TGT_DIR = Path.join(__dirname, '../../dist/');
const FAVICON_GLOB_SRC = Path.join(
  __dirname,
  '../../src/images/favicons/*.(png|ico)',
);
const FAVICON_GLOB_TGT_DIR = Path.join(__dirname, '../../dist/');
const SCRIPT_TARGET_GLOB = Path.join(
  __dirname,
  '../../src/js/site/*/index.jsx',
);
const STYLE_TARGET_GLOB = Path.join(
  __dirname,
  '../../src/scss/site/*/style.scss',
);
/* File paths used in prod mode */
const PROD_STATIC_PATH = Path.join(__dirname, '../../dist');

/* Routes for static files */
const STATIC_ROOT_ROUTE = '/static';
const SCRIPTS_EXTS = ['js'];
const STYLES_EXTS = ['css'];
const SHARED_ASSET_EXTS = ['ttf', 'eot', 'jpg', 'png'];
const STATIC_ROUTE_SCRIPT = `${STATIC_ROOT_ROUTE}/:view/[^/]+.(${SCRIPTS_EXTS.join(
  '|',
)})(.map)?`;
const STATIC_ROUTE_STYLE = `${STATIC_ROOT_ROUTE}/:view/[^/]+.(${STYLES_EXTS.join(
  '|',
)})(.map)?`;
const STATIC_ROUTE_SHARED_ASSET = `${STATIC_ROOT_ROUTE}/[^/]+.(${SHARED_ASSET_EXTS.join(
  '|',
)})`;
const IMG_ROOT_ROUTE = '/img';

const run = async (argv) => {
  const devMode = process.env.NODE_ENV === 'development';
  const devPortScript = devMode
    ? parseInt(argv['dev-port-script'], 10)
    : undefined;
  const devPortStyle = devMode
    ? parseInt(argv['dev-port-style'], 10)
    : undefined;
  const parcelOptionsScript = devMode
    ? argv['parcel-options-script']
    : undefined;
  const parcelOptionsStyle = devMode ? argv['parcel-options-style'] : undefined;
  const enableHttps = devMode || argv['local-prod-https'];
  const logPath = argv['log-path'];
  const logBaseFilename = argv['log-base-filename'];
  const logRotateSettings = argv['rotate-settings'];
  const {
    IMAGE_DIR_PATH: imageDirPath,
    SERVER_PORT: serverPort,
    SSL_KEY_PATH: sslKeyPath,
    SSL_CERT_PATH: sslCertPath,
    // ACCEPTED_HOSTS: acceptedHostsStr,
  } = process.env;

  let parcelServerScript;
  let parcelServerStyle;
  let parcelScriptMiddleware;
  let parcelStyleMiddleware;
  let templateWatcher;
  let staticPageWatcher;
  let faviconWatcher;
  let mainServer;

  if (devMode) {
    process.env.FORCE_COLOR = 2; // Enable color tts
    // Note: - HRM uses Websocket connection, which means running dev server
    //         requires Parcel servers to run in HTTPS mode as well. To reduce
    //         additional settings I decide to disable HRM on Parcel servers.
    parcelServerScript = exec(
      `npx parcel "${SCRIPT_TARGET_GLOB}" --port ${devPortScript} --public-url ${STATIC_ROOT_ROUTE} ${parcelOptionsScript} --no-hmr ${SCRIPT_TARGET_GLOB}`,
      { detached: true },
      (error) => {
        if (error) {
          process.stdout.write(
            'Parcel dev-script server terminated with error:\n',
          );
          process.stdout.write(error);
        }
        process.stdout.write(
          'Parcel dev-script server terminated successfully.\n',
        );
      },
    );
    parcelServerStyle = exec(
      `npx parcel "${STYLE_TARGET_GLOB}" --port ${devPortStyle} --public-url ${STATIC_ROOT_ROUTE} ${parcelOptionsStyle} --no-hmr ${STYLE_TARGET_GLOB}`,
      { detached: true },
      (error) => {
        if (error) {
          process.stdout.write(
            'Parcel dev-script server terminated with error:\n',
          );
          process.stdout.write(error);
        }
        process.stdout.write(
          'Parcel dev-style server terminated successfully.\n',
        );
      },
    );

    parcelServerScript.stdout.pipe(process.stdout);
    parcelServerScript.stderr.pipe(process.stderr);
    parcelServerStyle.stdout.pipe(process.stdout);
    parcelServerStyle.stderr.pipe(process.stderr);

    parcelScriptMiddleware = createProxyMiddleware({
      target: `http://localhost:${devPortScript}/`,
      changeOrigin: true,
    });
    parcelStyleMiddleware = createProxyMiddleware({
      target: `http://localhost:${devPortStyle}/`,
      changeOrigin: true,
    });

    /*
     *  - Chokidar will automatically trigger 'add' event on initial search, so
     *    it will run initial sync for us!
     *  - Currently we'll just take a lazy approach and omit all file system
     *    errors occur on cp/unlink operations.
     */
    if (
      !fs.existsSync(VIEW_TEMPLATE_GLOB_TGT_DIR)
      || !fs.lstatSync(VIEW_TEMPLATE_GLOB_TGT_DIR).isDirectory()
    ) {
      promiseFs.mkdir(VIEW_TEMPLATE_GLOB_TGT_DIR, { recursive: true });
    }
    if (
      !fs.existsSync(VIEW_STATIC_PAGE_GLOB_TGT_DIR)
      || !fs.lstatSync(VIEW_STATIC_PAGE_GLOB_TGT_DIR).isDirectory()
    ) {
      promiseFs.mkdir(VIEW_STATIC_PAGE_GLOB_TGT_DIR, { recursive: true });
    }
    if (
      !fs.existsSync(FAVICON_GLOB_TGT_DIR)
      || !fs.lstatSync(FAVICON_GLOB_TGT_DIR).isDirectory()
    ) {
      promiseFs.mkdir(FAVICON_GLOB_TGT_DIR, { recursive: true });
    }
    // Watcher for templates
    templateWatcher = chokidar.watch(VIEW_TEMPLATE_GLOB_SRC);
    templateWatcher.on('add', (filePath) => {
      const targetPath = Path.join(
        VIEW_TEMPLATE_GLOB_TGT_DIR,
        Path.basename(filePath),
      );
      stdout.write(
        `New template file "${filePath}" found. Syncing to dist directory...\n`,
      );
      promiseFs.copyFile(filePath, targetPath).catch(() => {});
    });
    templateWatcher.on('change', (filePath) => {
      const targetPath = Path.join(
        VIEW_TEMPLATE_GLOB_TGT_DIR,
        Path.basename(filePath),
      );
      stdout.write(
        `Detect change template file "${filePath}". Syncing to dist directory...\n`,
      );
      promiseFs.copyFile(filePath, targetPath).catch(() => {});
    });
    templateWatcher.on('unlink', (filePath) => {
      const targetPath = Path.join(
        VIEW_TEMPLATE_GLOB_TGT_DIR,
        Path.basename(filePath),
      );
      stdout.write(
        `Detect removal of template file "${filePath}". Syncing to dist directory...\n`,
      );
      promiseFs.unlink(targetPath).catch(() => {});
    });

    // Watcher for static pages
    staticPageWatcher = chokidar.watch(VIEW_STATIC_PAGE_GLOB_SRC);
    staticPageWatcher.on('add', (filePath) => {
      stdout.write(
        `New static template "${filePath}" found. Building to dist directory...\n`,
      );
      try {
        buildStaticPage(filePath);
      } catch (error) {
        stderr.write(`Error when building template ${filePath}:\n ${error}`);
      }
    });
    staticPageWatcher.on('change', (filePath) => {
      stdout.write(
        `New static template "${filePath}" found. Building to dist directory...\n`,
      );
      try {
        buildStaticPage(filePath);
      } catch (error) {
        stderr.write(`Error when building template ${filePath}:\n ${error}`);
      }
    });
    staticPageWatcher.on('unlink', (filePath) => {
      stdout.write(
        `Detect removal of static template "${filePath}" found. Syncing to dist directory...\n`,
      );
      try {
        removeStaticPage(filePath);
      } catch (error) {
        stderr.write(`Error when removing built static page:\n ${error}`);
      }
    });
    // Watcher for favicons
    faviconWatcher = chokidar.watch(FAVICON_GLOB_SRC);
    faviconWatcher.on('add', (filePath) => {
      const targetPath = Path.join(
        FAVICON_GLOB_TGT_DIR,
        Path.basename(filePath),
      );
      stdout.write(
        `New favicon file "${filePath}" found. Syncing to dist directory...\n`,
      );
      promiseFs.copyFile(filePath, targetPath).catch(() => {});
    });
    faviconWatcher.on('change', (filePath) => {
      const targetPath = Path.join(
        FAVICON_GLOB_TGT_DIR,
        Path.basename(filePath),
      );
      stdout.write(
        `Detect change on favicon "${filePath}". Syncing to dist directory...\n`,
      );
      promiseFs.copyFile(filePath, targetPath).catch(() => {});
    });
    faviconWatcher.on('unlink', (filePath) => {
      const targetPath = Path.join(
        FAVICON_GLOB_TGT_DIR,
        Path.basename(filePath),
      );
      stdout.write(
        `Detect removal of favicon "${filePath}". Syncing to dist directory...\n`,
      );
      promiseFs.unlink(targetPath).catch(() => {});
    });
  }

  const server = express();
  // Views
  server.set('views', VIEW_TEMPLATE_GLOB_TGT_DIR);
  server.set('view engine', 'pug');
  // Security headers
  server.use(helmet());
  // Default Favicon
  server.use(favicon(Path.join(PROD_STATIC_PATH, 'favicon.ico')));
  // JSON / URL support
  server.use(bodyParser.json());
  server.use(bodyParser.urlencoded({ extended: true }));

  // Register logger
  server.use(createLogger(logBaseFilename, logPath, logRotateSettings));

  const staticAssetHandler = express.static(PROD_STATIC_PATH);
  if (devMode) {
    server.use(STATIC_ROUTE_SCRIPT, parcelScriptMiddleware);
    server.use(STATIC_ROUTE_STYLE, parcelStyleMiddleware);
    // Note: Right now only CSS file uses shared assets.
    server.use(STATIC_ROUTE_SHARED_ASSET, parcelStyleMiddleware);
  } else {
    server.use(STATIC_ROOT_ROUTE, staticAssetHandler);
  }
  server.use(IMG_ROOT_ROUTE, express.static(imageDirPath));

  // Routers
  server.use('/', routerMain);
  server.use('/blog', routerBlog);
  // Error Response (currently 404) Handler
  if (devMode) {
    server.use(errorHandler());
  }
  server.use(routerError);

  if (enableHttps) {
    const sslKey = await promiseFs.readFile(sslKeyPath);
    const sslCert = await promiseFs.readFile(sslCertPath);
    mainServer = https.createServer({ key: sslKey, cert: sslCert }, server);
  } else {
    mainServer = server;
  }

  const serverHandle = mainServer.listen(serverPort, () => {
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
      if (staticPageWatcher !== undefined) {
        process.stdout.write('Terminating static page watcher...\n');
        staticPageWatcher.close();
      }
      if (faviconWatcher !== undefined) {
        process.stdout.write('Terminating favicon watcher...\n');
        faviconWatcher.close();
      }
    });
  });
};

module.exports = run;
