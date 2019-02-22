const path = require('path');
const { fork } = require('child_process');
const constants = require('../configs/constants');

fork(path.resolve(constants.DIST_DIR, 'index.js'));
