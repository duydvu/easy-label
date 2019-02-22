const program = require('commander');
const webpack = require('webpack');
const WebpackDevServer = require('webpack-dev-server');
const async = require('async');
const chalk = require('chalk');
const clientConfig = require('../configs/webpack.config');
const serverConfig = require('../configs/webpack.server.config');

const clientCompiler = webpack(clientConfig);
const serverCompiler = webpack(serverConfig);
const { devServer } = clientConfig;
let clientDevServer;
let serverWatcher;
let called = false;

program
    .option('-l, --long', 'Verbose stats')
    .parse(process.argv);

async.waterfall([
    (callback) => {
        clientDevServer = new WebpackDevServer(
            clientCompiler,
            !program.long ? devServer : Object.assign({}, devServer, {
                stats: { colors: true },
            }),
        );
        clientDevServer.listen(devServer.port, devServer.host, (err) => {
            if (err) {
                callback(err);
                return;
            }
            callback(null);
        });
    },
    (callback) => {
        serverWatcher = serverCompiler.watch(null, (err, stats) => {
            if (err) {
                callback(err);
                return;
            }

            const info = stats.toJson();
            if (stats.hasErrors()) {
                console.error(chalk.red(info.errors.join('\n')));
            }
            if (stats.hasWarnings()) {
                console.warn(chalk.yellow(info.warnings.join('\n')));
            }

            if (!called) {
                callback(null);
                called = true;
            }
        });
    },
], (err) => {
    if (err) {
        console.error(err.stack || err);
        if (err.details) {
            console.error(err.details);
        }
        clientDevServer.close(() => console.log('Client closed.'));
        if (serverWatcher) {
            serverWatcher.close(() => console.log('Server closed.'));
        }
    }
});
