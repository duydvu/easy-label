import React from 'react';
import { renderToString } from 'react-dom/server';
import { StaticRouter } from 'react-router-dom';
import Loadable from 'react-loadable';
import { getBundles } from 'react-loadable/webpack';
import { createStore } from 'redux';
import chalk from 'chalk';
import express from 'express'; /* eslint no-unused-vars: "off" */

/* eslint-disable import/no-unresolved */
import {
    state,
} from 'reducers';
import App from 'components/App';
/* eslint-enable import/no-unresolved */

import stats from '../../../../dist/react-loadable.json';
import compilationStats from '../../../../dist/compilation-stats.json';

const host = API_URL;

/**
 * Rendering function WITHOUT SSR
 * @param {express.Request} req - The request object.
 * @param {express.Response} res - The response object.
 * @param {String} ejs - The name of the template file to be rendered.
 * @param {String} title - The title of the generated html file.
 * @param {Object} [initState={}] - The initial state of Redux store.
 * @param {Number} [status=200] - The status code to response.
 * @param {Object} [others={}] - Other metadata information to render the template
 *  such as description, keywords, etc.
 */
const renderWithoutSSR = (req, res, ejs, title, initState = {}, status = 200, others = {}) => {
    const staticContext = { statusCode: status };
    const store = createStore(state, initState);
    const data = {
        title,
        html: '',
        bundles: [],
        preloadedState: store.getState(),
        url: host + req.originalUrl,
        nonce: res.locals.nonce,
        others,
    };
    res.status(staticContext.statusCode);
    res.render(ejs, { data });
};

/**
 * Rendering function WITH SSR
 * @param {express.Request} req - The request object.
 * @param {express.Response} res - The response object.
 * @param {String} ejs - The name of the template file to be rendered.
 * @param {String} title - The title of the generated html file.
 * @param {Object} initState - The initial state of Redux store.
 * @param {Number} [status=200] - The status code to response.
 * @param {Object} [others={}] - Other metadata information to render the template
 *  such as description, keywords, etc.
 */
const renderWithSSR = (req, res, ejs, title, initState, status = 200, others = {}) => {
    const staticContext = { statusCode: status };
    const store = createStore(state, initState);

    const modules = [];
    const html = renderToString(
        <Loadable.Capture report={moduleName => modules.push(moduleName)}>
            <StaticRouter location={req.url} context={staticContext}>
                <App store={store} />
            </StaticRouter>
        </Loadable.Capture>,
    );
    const bundles = getBundles(stats, modules);

    const data = {
        title,
        html,
        bundles,
        preloadedState: store.getState(),
        url: host + req.originalUrl,
        nonce: res.locals.nonce,
        hash: compilationStats.hash,
        others,
    };

    res.status(staticContext.statusCode);
    res.render(ejs, { data });
};

let render = renderWithoutSSR; // eslint-disable-line import/no-mutable-exports
if (process.env.SSR === 'true') {
    console.log(chalk.blue('SERVER-SIDE RENDERING ON!'));
    render = renderWithSSR;
}

export default render;
