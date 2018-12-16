'use strict';

import { get, omitBy, isNil, sumBy } from 'lodash';

import { DEFAULT_PAGE_LIMIT } from '../enums';
import { now } from 'moment';

async function find(req, res, next) {
    const { PurchaseOrder, User } = req.app.get('models');

    const limit = parseInt(get(req.query, 'limit', DEFAULT_PAGE_LIMIT));

    const page = parseInt(get(req.query, 'page', 1));

    const query = JSON.parse(get(req.query, 'query', '{}'));

    const sort = JSON.parse(get(req.query, 'sort', '{}'));

    const user = req.user;

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
        query.warehouseId = user.warehouseId;
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
async function sendNotification(data, to="notifications"){
    let Pusher = require('pusher');
    let pusher = new Pusher({
        appId: "665345",
        key: "32f3c61f78d9f66b2d26",
        secret: "77a38bfba30ee9b1ff85",
        cluster: "ap1"
    });

    pusher.trigger(to, 'post_updated',data);
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
    const { PurchaseOrder, User } = req.app.get('models');
    const user = req.user;

    const data = req.body;
    data.warehouseId = user.warehouseId;
    data.createdBy = user.id;
    try {
        const purchaseOrder = await PurchaseOrder.create(data);
        const user_kho = await User.findByRoleAndWarehouseId("stocker",user.warehouseId);
        const badge = await PurchaseOrder.find({'status': 'pending'}).count();
        // TODO: handle response format
        user_kho.map((user)=>{sendNotification({
            purchaseOrderId: purchaseOrder.id,
            badge: badge,
            title: "Bạn có 1 tin nhắn mới",
            body: 'Có một đơn chờ chuyệt'
        }, user.username)});
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

async function invoiceApproval(req, res, next) {
    const { PurchaseOrder, Product } = req.app.get('models');
    const { id } = req.params;
    const user = req.user;
    const status = get(req.query, 'status', false);
    try {
        const item = await PurchaseOrder.findById(id).populate('products.product');
        if (!item) return next('error 404 product not found');
        if(status){
            item.products.map( async (product)=>{
                let statistical = product.product.statistical;
                if (item.orderType == "in")
                    statistical[product.productType]+=product.quantity;
                else{
                    let caculate = statistical[product.productType] - product.quantity;
                    if(caculate<0) return res.status(400);
                    statistical[product.productType]-=product.quantity;
                }
                await Product.update({_id: product.product._id},{$set: {statistical: statistical}});
            });
        }
        await PurchaseOrder.update({_id: id, warehouseId: user.warehouseId},
            {
                status: status?"accepted":"rejected",
                 updatedBy: user.id
            });
        return res.status(204).json(item);
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
    invoiceApproval,
};

export {
    PurchaseOrderController
};
