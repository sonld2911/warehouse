'use strict';

import { get, isNil, omitBy } from 'lodash';
import { DEFAULT_PAGE_LIMIT } from '../enums';

async function find(req, res, next) {
    const { Product } = req.app.get('models');
    const user = req.user;

    const limit = parseInt(get(req.query, 'limit', DEFAULT_PAGE_LIMIT));

    const page = parseInt(get(req.query, 'page', 1));

    const query = JSON.parse(get(req.query, 'query', '{}'));

    const sort = JSON.parse(get(req.query, 'sort', '{}'));

    const options = {
        page,
        limit,
        sort,
    };

    // DEFAULT QUERY ONLY IN CURRENT USER WAREHOUSE
    query.warehouseId = user.warehouseId;

    try {
        const results = await Product.paginate(query, options);

        const count = results.totalDocs;

        const products = results.docs;

        return res.json({
            items: products,
            count,
        });
    } catch (err) {
        return next(err);
    }
}

async function findOne(req, res, next) {
    const { id } = req.params;
    const { Product } = req.app.get('models');

    try {
        const product = await Product.findById(id);

        if (!product) {
            return next('error 404 product not found');
        }

        return res.json(product);
    } catch (err) {
        // TODO: handle error
        return next(err);
    }
}

async function create(req, res, next) {
    const data = req.body;
    const user = req.user;
    const { Product } = req.app.get('models');

    try {
        // TODO: validate duplicate
        if (await Product.isProductCodeExists(data.code)) {
            return next('duplicate');
        }

        // TODO:
        data.warehouseId = user.warehouseId;
        data.statistical = {new: 0, recovery: 0, guarantee: 0};

        const product = await Product.create(data);

        // TODO:
        return res.json(product);
    } catch (err) {
        // TODO:
        return next(err);
    }
}

async function update(req, res, next) {
    const { id } = req.params;
    const { Product } = req.app.get('models');

    try {
        const product = await Product.findById(id);

        if (!product) {
            return next('404 product not found');
        }

        const data = omitBy({
            code: get(req.body, 'code'),
            name: get(req.body, 'name'),
            description: get(req.body, 'description'),
            manufacturer: get(req.body, 'manufacturer'),
            machinePart: get(req.body, 'machinePart'),
            technicalSpecifications: get(req.body, 'technicalSpecifications'),
            unit: get(req.body, 'unit'),
            kind: get(req.body, 'kind'),
        }, isNil);

        for (const key in data) {
            product[key] = data[key];
        }

        await product.save();

        return res.json(product);
    } catch (err) {
        // TODO:
        return next(err);
    }
}

async function remove(req, res, next) {
    const { id } = req.params;
    const { Product } = req.app.get('models');

    try {
        await Product.findByIdAndDelete(id);

        return res.status(204).json({});
    } catch (err) {
        // TODO:
        return next(err);
    }
}

const ProductController = {
    find,
    findOne,
    create,
    update,
    remove,
};

export {
    ProductController,
};
