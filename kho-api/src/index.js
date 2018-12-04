'use strict';

import { listen } from './app';
import { db, connect } from './models';
import logger from './logger';

db
    .on('error', (err) => {
        logger.error(err);
        process.exit();
    })
    .on('disconnected', connect)
    .once('open', listen);
