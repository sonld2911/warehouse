'use strict';

import {
    BadRequest,
    NotFound,
    InternalServerError,
    UnprocessableEntity
} from 'throw.js';
import { get, isEmpty } from 'lodash';
import { DEFAULT_PAGE_LIMIT } from '../enums';

async function list(req, res, next) {
    const {User} = req.app.get('models');

    const limit = parseInt(get(req.query, 'limit', DEFAULT_PAGE_LIMIT));
    const page = parseInt(get(req.query, 'page', 1));

    const filter = JSON.parse(get(req.query, 'filter', '{}'));

    const query = {};

    if (filter.username) {
        query.username = {'$regex': filter.username};
    }
    if (filter.role) {
        query.role = filter.role;
    }
    const options = {
        page,
        limit,
        populate: get(filter, 'populate', {}),
    };

    try {
        const results = await User.paginate(query, options);

        const count = results.totalDocs;
        const users = results.docs;

        return res.json({
            items: users,
            count,
        });
    } catch (err) {
        return next(new InternalServerError(err));
    }
}

async function create(req, res, next) {
    const data = req.body;
    const {User} = req.app.get('models');

    try {
        if (isEmpty(data.warehouseId)) {
            delete data.warehouseId;
        }

        const user = await User.create(data);

        return res.json(user);
    } catch (err) {
        return next(new UnprocessableEntity(err));
    }
}

async function update(req, res, next) {
    const {id} = req.params;
    const data = req.body;
    const {User} = req.app.get('models');

    try {
        const user = await User.findById(id);

        if (!user) {
            return next(new NotFound());
        }

        if (isEmpty(data.password)) {
            delete data.pass;
        }

        if (isEmpty(data.warehouseId)) {
            data.warehouseId = null;
        }

        user.set({...data});

        await user.save();

        return res.json(user);
    } catch (err) {
        return next(new UnprocessableEntity(err));
    }
}

async function remove(req, res, next) {
    const {id} = req.params;
    const {User} = req.app.get('models');

    try {
        await User.findByIdAndDelete(id);

        return res.status(204).json({});
    } catch (err) {
        return next(new InternalServerError());
    }
}

async function findOne(req, res, next) {
    const { id } = req.params;
    const { User } = req.app.get('models');

    try {
        const user = await User.findById(id);

        if (!user) {
            throw new Error('404 user not found');
        }

        return res.json(user);
    } catch (err) {
        // TODO: handle error
        return next(err);
    }
}

const UserController = {
    list,
    create,
    update,
    remove,
    findOne,
};

export {
    UserController,
};
