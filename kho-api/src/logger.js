'use strict';

import winston from 'winston';
import 'winston-daily-rotate-file';
import moment from 'moment';
import path from 'path';

const TIMESTAMP_FORMAT = 'YYYY-MM-DD HH:mm:ss.SSS';

const logger = new winston.Logger({
    transports: [

        new winston.transports.Console({
            name: 'app_console_log',
            level: process.env.APP_LOG_LEVEL || 'info',
            colorize: true,
            timestamp: () => {
                return moment().format(TIMESTAMP_FORMAT);
            },
        }),

        new winston.transports.DailyRotateFile({
            name: 'app_daily_log',
            filename: path.resolve(__dirname, '../', 'logs', 'app.%DATE%.log'),
            datePattern: 'YYYY-MM-DD',
            prepend: true,
            zippedArchive: true,
            level: process.env.APP_LOG_LEVEL || 'info',
            timestamp: function () {
                return moment().format(TIMESTAMP_FORMAT);
            },
        }),
    ],
});

export default logger;
