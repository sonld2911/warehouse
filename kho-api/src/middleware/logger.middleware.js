'use strict';

import morgan from 'morgan';
import split from 'split';
import logger from '../logger';
import { CONFIG } from '../config';

const LoggerMiddleware = morgan('combined', {
    'stream': split().on('data', (line) => {
        logger.info(line);
    }),
    'skip': () => CONFIG.ENV === 'test',
});

export {
    LoggerMiddleware,
};
