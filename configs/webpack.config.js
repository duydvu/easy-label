const chalk = require('chalk');
const webpack = require('webpack');
const merge = require('webpack-merge');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const constants = require('./constants.js');

const { config } = constants;

// Get npm script
const TARGET = process.env.npm_lifecycle_event;

// Get common config
const common = require('./webpack.common.config.js');

if (TARGET !== 'build') {
    // Development mode
    console.log(chalk.red.bold('DEVELOPMENT MODE'));
    module.exports = merge(common, {

        mode: 'development',

        output: {
            filename: '[name].bundle.js',
            chunkFilename: '[name].bundle.js',
        },

        devtool: 'cheap-module-eval-source-map',

        devServer: {
            historyApiFallback: true,
            inline: true,
            host: 'localhost',
            port: config.WEBPACK_PORT,
            publicPath: '/build/',
            proxy: {
                '/': {
                    target: constants.LOCALHOST,
                },
            },
            open: true,
            stats: 'minimal',
            overlay: true,
        },

        plugins: [
            // This makes everything reloaded when you change files
            new webpack.HotModuleReplacementPlugin(),
            new webpack.DefinePlugin({
                API_URL: JSON.stringify(config.API_URL),
            }),
        ],

    });
}
else {
    // Production mode
    console.log(chalk.green.bold('PRODUCTION MODE'));
    module.exports = merge(common, {

        mode: 'production',

        output: {
            filename: '[name].bundle.[hash].js',
            chunkFilename: '[name].bundle.[hash].js',
        },

        optimization: {
            splitChunks: {
                cacheGroups: {
                    default: false,
                    vendors: false,
                },
            },
        },

        plugins: [
            new webpack.DefinePlugin({
                API_URL: JSON.stringify(config.API_URL),
                'process.env': {
                    NODE_ENV: JSON.stringify('production'),
                },
            }),
            new UglifyJSPlugin(),
            new CleanWebpackPlugin([constants.PUBLIC_DIR], {
                root: constants.WORK_DIR,
                exclude: ['.gitkeep'],
            }),
            new CopyWebpackPlugin([{
                from: constants.STATIC_DIR,
                to: constants.PUBLIC_DIR,
                ignore: ['*.development.*', 'README.md'],
            }]),
            new BundleAnalyzerPlugin({
                analyzerMode: 'static',
                openAnalyzer: false,
            }),
        ],

    });
}
