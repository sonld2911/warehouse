'use strict';

import { get } from 'lodash';
import path from 'path';

require('dotenv').config();

const CONFIG = {
    ROOT_DIR: path.join(__dirname, '../..'),

    ENV: get(process.env, 'APP_ENV', 'development'),
    PORT: get(process.env, 'PORT', 3000),
    SESSION_SECRET: get(process.env, 'SESSION_SECRET', 'session secret'),

    MONGODB_URI: get(process.env, 'APP_MONGODB_URI'),

    JWT_ENCRYPTION: get(process.env, 'JWT_ENCRYPTION', 'jwt_secret'),
    JWT_EXPIRATION: get(process.env, 'JWT_EXPIRATION', '30d'),

    LOG_LEVEL: get(process.env, 'APP_LOG_LEVEL', 'debug'),

    UPLOAD_TEMP_PATH: get(process.env, 'UPLOAD_TEMP_PATH', 'uploads/_temp'),
    // eslint-disable-next-line
    AVATAR_UPLOAD_PATH: get(process.env, 'AVATAR_UPLOAD_PATH', 'uploads/avatars'),
    AVATAR_MAX_FILE_SIZE: get(process.env, 'AVATAR_MAX_FILE_SIZE', 1000000),
};

export {
    CONFIG,
};
