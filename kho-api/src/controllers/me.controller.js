'use strict';

import { get, pick, isEmpty } from 'lodash';

async function profile(req, res, next) {
    const { User } = req.app.get('models');
    const id = get(req, 'user');

    if (!id) {
        // TODO: handle error
        return next('404');
    }

    try {
        const user = await User
            .findById(id)
            .populate('warehouseId');

        // TODO: check if user is exists

        return res.json(user);
    } catch (err) {
        // TODO: handle error
        return next(err);
    }
}

async function changeProfile(req, res, next) {
    const { User } = req.app.get('models');
    const currentUser = req.user;

    try {
        const user = await User.findById(currentUser.id);

        if (!user) {
            // TODO: handle error
            return next(new Error());
        }

        const data = pick(req.body, [
            'name',
            'email',
            'password',
            'gender',
        ]);

        if (isEmpty(data.password)) {
            delete data.password;
        }

        user.set({...data});

        await user.save();

        return res.json(user);
    } catch (err) {
        return next(err);
    }
}

const MeController = {
    profile,
    changeProfile,
};

export {
    MeController,
};
