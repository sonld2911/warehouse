'use strict';

import { BadRequest } from 'throw.js';
import passport from 'passport';

async function login(req, res, next) {
    return passport.authenticate('local', { session: false },
        function authenticate(err, user) {

            if (err || false === user) {
                return next(new BadRequest());
            }

            const accessToken = user.generateJWT();

            const data = {
                access_token: accessToken,
            };

            return res.json(data);
        })(req, res, next);
}

const AuthController = {
    login,
};

export {
    AuthController,
};
