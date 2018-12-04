'use strict';

import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';
import { CONFIG } from './config';

/**
 * SIGN IN USING USERNAME AND PASSWORD
 */
function localStrategy() {
    const options = {
        usernameField: 'username',
        passwordField: 'password',
        passReqToCallback: true,
    };

    return new LocalStrategy(
        options,
        async function (req, username, password, next) {

            const { User } = req.app.get('models');

            try {
                const user = await User.findByUsername(username);

                if (!user) {
                    return next(null, false);
                }

                if (false === await user.comparePassword(password)) {
                    return next(null, false);
                }

                return next(null, user);
            } catch (err) {
                return next(err);
            }
        },
    );
}

/**
 * AUTHENTICATE USER BY ACCESS TOKEN
 */
const AUTH_SCHEME = 'bearer';
const TOKEN_QUERY_PARAMETER_NAME = 'access_token';

function jwtStrategy() {
    const options = {
        jwtFromRequest: ExtractJwt.versionOneCompatibility({
            authScheme: AUTH_SCHEME,
            tokenQueryParameterName: TOKEN_QUERY_PARAMETER_NAME,
        }),
        secretOrKey: CONFIG.JWT_ENCRYPTION,
        passReqToCallback: true,
    };

    return new JwtStrategy(options, async function (req, payload, next) {
        const { User } = req.app.get('models');

        const { id } = payload;

        try {
            const user = await User.findById(id);

            if (!user) {
                return next(null, false);
            }

            return next(null, user);
        } catch (err) {
            return next(err);
        }
    });
}

passport.use(localStrategy());
passport.use(jwtStrategy());

function initialize() {
    return passport.initialize();
}

function authenticate() {
    return passport.authenticate('jwt', { session: false });
}

export {
    initialize,
    authenticate,
};
