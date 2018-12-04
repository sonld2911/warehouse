'use strict';

import { checkSchema } from 'express-validator/check';
import { isEmpty, values } from 'lodash';
import { ROLE } from '../enums';

export const UserCreateMiddleware = () => {
    return checkSchema({
        name: {
            trim: true,
            custom: {
                options: (value) => {
                    return !isEmpty(value);
                },
            },
            errorMessage: 'REQUIRED',
        },
        email: {
            isEmail: true,
            normalizeEmail: true,
        },
        password: {
            isLength: {
                options: {
                    min: 6,
                },
            },
        },
        role: {
            in: {
                options: {

                }
            },
        },
    });
};
