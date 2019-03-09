const webpack = require('webpack');
const path = require('path');
const fs = require('fs');
const async = require('async');
const clientConfig = require('../configs/webpack.config');
const serverConfig = require('../configs/webpack.server.config');
const constants = require('../configs/constants');
const {
    errorHandler,
} = require('./utils');

const clientCompiler = webpack(clientConfig);
const serverCompiler = webpack(serverConfig);

async.series([
    (callback) => {
        clientCompiler.run((err, stats) => {
            if (err) {
                callback(err);
                return;
            }

            // Get the hash
            const onlyHash = {
                hash: stats.hash,
            };
            const filePath = path.resolve(constants.DIST_DIR, 'compilation-stats.json');

            fs.writeFile(filePath, JSON.stringify(onlyHash), (_err) => {
                if (_err) {
                    callback(_err);
                    return;
                }
                console.log(stats.toString({ colors: true }));
                callback(null);
            });
        });
    },
    (callback) => {
        serverCompiler.run((err, stats) => {
            if (err) {
                callback(err);
                return;
            }
            console.log(stats.toString({ colors: true }));
            callback(null);
        });
    },
], (err) => {
    if (err) {
        errorHandler(err);
    }
});
