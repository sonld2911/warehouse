'use strict';

import { get, omitBy, isNil, sumBy } from 'lodash';

import { DEFAULT_PAGE_LIMIT } from '../enums';

async function find(req, res, next) {
    const { PurchaseOrder } = req.app.get('models');

    const limit = parseInt(get(req.query, 'limit', DEFAULT_PAGE_LIMIT));

    const page = parseInt(get(req.query, 'page', 1));

    const query = JSON.parse(get(req.query, 'query', '{}'));

    const sort = JSON.parse(get(req.query, 'sort', '{}'));

    // const query = {};

    /*if (filter.hasOwnProperty('code')) {
        query['code'] = filter.code;
    }

    if (filter.hasOwnProperty('name')) {
        query['name'] = filter.name;
    }*/

    const options = {
        page,
        limit,
        sort,
    };

    /*if (has(filter, 'populate')) {
        options.populate = get(filter, 'populate');
    }*/

    try {
        const results = await PurchaseOrder.paginate(query, options);

        const count = results.totalDocs;

        const items = results.docs;

        return res.json({
            items,
            count,
        });
    } catch (err) {
        // TODO: handle error
        return next(err);
    }
}

async function findOne(req, res, next) {
    const { PurchaseOrder } = req.app.get('models');
    const { id } = req.params;

    try {
        const item = await PurchaseOrder
            .findById(id)
            .populate('products.product');

        if (!item) {
            return next('error 404 product not found');
        }

        return res.json(item);
    } catch (err) {
        // TODO: handle error
        return next(err);
    }
}

async function create(req, res, next) {
    const { PurchaseOrder } = req.app.get('models');
    const user = req.user;

    const data = req.body;
    data.warehouseId = user.warehouseId;
    data.createdBy = user.id;

    try {
        const purchaseOrder = await PurchaseOrder.create(data);

        // TODO: handle response format
        return res.json(purchaseOrder);
    } catch (err) {
        // TODO: validate write error
        return next(err);
    }
}

async function update(req, res, next) {
    const { PurchaseOrder } = req.app.get('models');
    const { id } = req.params;
    const { user } = req;
    const data = req.body;

    try {
        const purchaseOrder = await PurchaseOrder.findById(id);

        if (!purchaseOrder) {
            return next('404 not found');
        }

        data.updatedBy = user.id;

        for (const key in data) {
            purchaseOrder[key] = data[key];
        }

        await purchaseOrder.save();

        return res.json(purchaseOrder);
    } catch (err) {
        return next(err);
    }
}

async function remove(req, res, next) {
    const { PurchaseOrder } = req.app.get('models');
    const { id } = req.params;

    try {
        await PurchaseOrder.findByIdAndDelete(id);

        return res.status(204).json({});
    } catch (err) {
        return next(err);
    }
}

const PurchaseOrderController = {
    find,
    findOne,
    create,
    update,
    remove,
};

export {
    PurchaseOrderController
};
