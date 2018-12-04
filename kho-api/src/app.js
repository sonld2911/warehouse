'use strict';

import path from 'path';
import express from 'express';
import bodyParser from 'body-parser';
import { NotFound } from 'throw.js';
import { CONFIG } from './config';
import { models } from './models';
import logger from './logger';
import { apiRoutes } from './routes';
import { LoggerMiddleware } from './middleware';
import * as auth from './auth';
import cors from 'cors';

const app = express();

/**
 * LOGGER MIDDLEWARE REGISTER
 */
app.use(LoggerMiddleware);

/**
 * SECURITY MIDDLEWARE
 */
app.use(cors());

/**
 * SINGLETON APP MODELS
 */
app.set('models', models);

/**
 * OTHER MIDDLEWARE
 */
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

/**
 * PASSPORT INITIALIZE
 */
app.use(auth.initialize());

/**
 * API ROUTES REGISTER
 */
app.use('/api', apiRoutes);

/**
 * CATCH 404 ERROR HANDLER
 */
app.use((req, res, next) => {
    return next(new NotFound());
});

/**
 * CATCH ALL ERRORS HANDLER
 */
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {

    logger.error(err);

    return res.status(err.statusCode || 500).json({
        'status': 'error',
        'message': err.message,
        'code': err.errorCode,
    });

});

function listen() {
    app.listen(CONFIG.PORT,
        () => logger.info(`App is listening on port ${CONFIG.PORT}`));
}

export {
    app,
    listen,
};
