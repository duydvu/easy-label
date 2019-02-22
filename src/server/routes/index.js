import express from 'express'; // eslint-disable-line no-unused-vars

// Views
import * as views from './views';

/**
 * Route handler
 * @param {express.Application} app - Application object.
 */
const RouteHandler = (app) => {
    app.get('/', views.index);
};

export default RouteHandler;
