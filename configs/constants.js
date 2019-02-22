const path = require('path');
const config = require('../config.js');

// Declare paths
// level 0
const WORK_DIR = path.resolve(__dirname, '../');
// level 1
const APP_DIR = path.resolve(WORK_DIR, 'src/client', config.APP);
const SERVER_DIR = path.resolve(WORK_DIR, 'src/server');
const DIST_DIR = path.resolve(WORK_DIR, 'dist');
const STATIC_DIR = path.resolve(WORK_DIR, 'static');
// level 2
const TEMPLATES_DIR = path.resolve(SERVER_DIR, 'templates');
const PROD_TEMPLATES_DIR = path.resolve(DIST_DIR, 'templates');
const PUBLIC_DIR = path.resolve(DIST_DIR, 'public');
// level 3
const BUILD_DIR = path.resolve(PUBLIC_DIR, 'build');

const LOCALHOST = `http://localhost:${config.PORT}`;
const WEBPACK_LOCALHOST = `http://localhost:${config.WEBPACK_PORT}`;

module.exports = {
    config,
    WORK_DIR,
    APP_DIR,
    SERVER_DIR,
    DIST_DIR,
    STATIC_DIR,
    TEMPLATES_DIR,
    PROD_TEMPLATES_DIR,
    PUBLIC_DIR,
    BUILD_DIR,
    LOCALHOST,
    WEBPACK_LOCALHOST,
};
