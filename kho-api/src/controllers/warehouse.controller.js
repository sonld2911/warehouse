'use strict';

import { DEFAULT_PAGE_LIMIT } from '../enums';
import { get } from 'lodash';
import HTTP_STATUS from 'http-status';

async function list(req, res, next) {
    const { Warehouse } = req.app.get('models');

    const limit = parseInt(get(req.query, 'limit', DEFAULT_PAGE_LIMIT));
    const page = parseInt(get(req.query, 'page', 1));

    const query = {};

    const options = {
        page,
        limit,
    };

    try {
        const results = await Warehouse.paginate(query, options);

        const count = results.totalDocs;
        const warehouses = results.docs;

        return res.json({
            items: warehouses,
            count,
        });
    } catch (err) {
        // TODO: handle error response
        return next(err);
    }
}

async function create(req, res, next) {
    const { Warehouse } = req.app.get('models');
    const data = req.body;

    try {
        // TODO: validate before create
        const warehouse = await Warehouse.create(data);

        // TODO: handle response content
        return res.json(warehouse);
    } catch (err) {
        // TODO: handle error response
        return next(err);
    }
}

async function update(req, res, next) {
    const { Warehouse } = req.app.get('models');
    const { id } = req.params;
    const data = req.body;

    try {
        const warehouse = await Warehouse.findById(id);

        if (!warehouse) {
            // TODO: handle model not found error response
            return next('404');
        }

        // TODO: validate data before save
        warehouse.set({...data});

        await warehouse.save();

        // TODO: handle response
        return res.json(warehouse);
    } catch (err) {
        // TODO: handle error response
        return next(err);
    }
}

async function remove(req, res, next) {
    const { Warehouse } = req.app.get('models');
    const { id } = req.params;

    try {
        await Warehouse.findByIdAndDelete(id);

        return res.status(HTTP_STATUS.NO_CONTENT).json({});
    } catch (err) {
        // TODO: handle error response
        return next(err);
    }
}

export const WarehouseController = {
    list,
    create,
    update,
    remove,
};
