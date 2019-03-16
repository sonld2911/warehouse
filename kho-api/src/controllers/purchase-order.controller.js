'use strict';

import {get, omitBy, isNil, sumBy} from 'lodash';

import {DEFAULT_PAGE_LIMIT, ROLE, PURCHASE_ORDER_STATUS} from '../enums';
import {now} from 'moment';
import {stat} from 'fs';

const Pusher = require('pusher');
const pusher = new Pusher({
    appId: '665346',
    key: 'bbe0eadeb38f6154df71',
    secret: 'b04faba27d6ad9ad5bb0',
    cluster: 'ap1',
    encrypted: true
});

async function find(req, res, next) {
    const {PurchaseOrder, User} = req.app.get('models');

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

async function sendNotification(data, to = "notifications") {
    console.log("sen to" + to);
    await pusher.trigger(to, 'post_updated', data);
}

async function invoiceManagement(req, res, next) {
    const {PurchaseOrder, User} = req.app.get('models');
    const user = req.user;
    try {
        const items = await PurchaseOrder.aggregate([
            {$match: {warehouseId: user.warehouseId}},
            {$project: {status: 1, orderType: 1}}
        ]);
        let data = {
            in: {
                pending: 0,
                accepted: 0,
                rejected: 0,
            },
            out: {
                pending: 0,
                accepted: 0,
                rejected: 0,
            }
        };
        items.map(item => {
            data[item.orderType][item.status] += 1;
        });
        if (!items) {
            return next('error 404 product not found');
        }
        return res.json(data);
    } catch (err) {
        // TODO: handle error
        return next(err);
    }
}

async function findOne(req, res, next) {
    const {PurchaseOrder, User} = req.app.get('models');
    const {id} = req.params;
    try {
        const item = await PurchaseOrder
            .findById(id)
            .populate('products.product')
            .populate('createdBy')
            .populate('updatedBy')
            .populate('assignees.user')
            .populate('approval');
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
    const {PurchaseOrder, User} = req.app.get('models');
    const user = req.user;
    const assignees = get(req.body, 'assignees', null);
    const data = req.body;
    data.warehouseId = user.warehouseId;
    data.createdBy = user.id;
    try {
        let user_assignees;
        if (assignees && req.body.orderType == "out") {
            user_assignees = await User.findByIdAndRoleAndWarehouseId(assignees, ROLE.REPAIR, user.warehouseId);
            data.assignees = [
                {user: user.id, status: PURCHASE_ORDER_STATUS.ACCEPTED, dateTime: new Date()},
                {user: assignees, status: PURCHASE_ORDER_STATUS.PENDING, dateTime: new Date()}
            ];
            data.approval = assignees;
        } else
            user_assignees = await User.findByRoleAndWarehouseId("stocker", user.warehouseId);
        console.log("trungtn", user_assignees);
        if (!user_assignees)
            return next('error 404 assignees not found');
        const purchaseOrder = await PurchaseOrder.create(data);
        const badge = await PurchaseOrder.find({'status': 'pending'}).count();
        // TODO: handle response format
        user_assignees.map((user) => {
            sendNotification({
                purchaseOrderId: purchaseOrder.id,
                badge: badge,
                title: "Bạn có 1 tin nhắn mới",
                body: 'Có một đơn chờ chuyệt'
            }, user.username)
        });
        return res.json(purchaseOrder);
    } catch (err) {
        // TODO: validate write error
        return next(err);
    }
}

async function update(req, res, next) {
    const {PurchaseOrder, User} = req.app.get('models');
    const {id} = req.params;
    const {user} = req;
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
        if (purchaseOrder.orderType == "out" && user.role == "stocker") {
            for (let i = 0; i < purchaseOrder.assignees.length; i++) {
                purchaseOrder.assignees[i].status = PURCHASE_ORDER_STATUS.PENDING;
            }
            purchaseOrder.approval = purchaseOrder.assignees[0].user;
            let sendToUser = await User.find({_id: purchaseOrder.assignees[0].user});
            await sendNotification({
                purchaseOrderId: id,
                badge: 0,
                title: "Bạn có 1 tin nhắn mới",
                body: 'Có một đơn chờ chuyệt'
            }, sendToUser.username)
        }
        await purchaseOrder.save();

        return res.json(purchaseOrder);
    } catch (err) {
        return next(err);
    }
}

async function remove(req, res, next) {
    const {PurchaseOrder} = req.app.get('models');
    const {id} = req.params;

    try {
        await PurchaseOrder.findByIdAndDelete(id);
        return res.status(204).json({});
    } catch (err) {
        return next(err);
    }
}

async function invoiceApproval(req, res, next) {
    const {PurchaseOrder, Product, User} = req.app.get('models');
    const {id} = req.params;
    const user = req.user;
    const status = get(req.query, 'status', false);
    const assignees = get(req.query, 'assignees', null);
    try {
        const item = await PurchaseOrder.findById(id).populate('products.product');
        if (!item || item.status != "pending") return res.status(403).json(null);

        if (item.orderType == "out") {
            let listAssignees = item.assignees;
            let output = {};
            if (item.assignees.length < 4) {
                listAssignees[listAssignees.length - 1].status = (status == 'true') ? PURCHASE_ORDER_STATUS.ACCEPTED : PURCHASE_ORDER_STATUS.REJECTED;
                listAssignees[listAssignees.length - 1].dateTime = new Date();
                if (user.role == ROLE.TECHNICAL && !(status == 'true')) {
                    output = {
                        status: PURCHASE_ORDER_STATUS.REJECTED,
                        assignees: listAssignees
                    }
                } else {
                    if (!assignees) return res.status(403).json(null);
                    listAssignees.push({user: assignees, status: PURCHASE_ORDER_STATUS.PENDING, dateTime: new Date()});
                    output = {
                        assignees: listAssignees,
                        approval: assignees
                    };
                    let user_assignees = await User.find({_id: assignees});
                    user_assignees.map(async (user) => {
                        await sendNotification({
                            purchaseOrderId: id,
                            badge: 0,
                            title: "Bạn có 1 tin nhắn mới",
                            body: 'Có một đơn chờ chuyệt'
                        }, user.username)
                    });
                }
            } else {
                let userIdApproval = 0;
                for (let i = 0; i < listAssignees.length; i++) {
                    if (listAssignees[i].user == user.id) {
                        listAssignees[i].status = (status == 'true') ? PURCHASE_ORDER_STATUS.ACCEPTED : PURCHASE_ORDER_STATUS.REJECTED;
                        listAssignees[i].dateTime = new Date();
                        userIdApproval = i;
                        break;
                    }
                }
                if (user.role == ROLE.STOCKER) {
                    output = {
                        status: (status == 'true') ? PURCHASE_ORDER_STATUS.ACCEPTED : PURCHASE_ORDER_STATUS.REJECTED,
                        assignees: listAssignees
                    };
                    if (status) {
                        item.products.map((product) => {
                            let statistical = product.product.statistical;
                            let calculator = statistical[product.productType] - product.quantity;
                            if (calculator < 0) return res.status(404).json({errorMessage: "Số lượng không "});
                        });
                        item.products.map(async (product) => {
                            let statistical = product.product.statistical;
                            statistical[product.productType] -= product.quantity;
                            await Product.update({_id: product.product._id}, {$set: {statistical: statistical}});
                        });
                    }
                }else {
                    output = {
                        assignees: listAssignees,
                        approval: listAssignees[userIdApproval+1].user
                    };
                    let user_assignees = await User.find({_id: listAssignees[userIdApproval+1].user});
                    user_assignees.map(async (user) => {
                        await sendNotification({
                            purchaseOrderId: id,
                            badge: 0,
                            title: "Bạn có 1 tin nhắn mới",
                            body: 'Có một đơn chờ chuyệt'
                        }, user.username)
                    });
                }
            }
            await PurchaseOrder.update({_id: id, warehouseId: user.warehouseId}, output);
        } else {
            if (user.role !== ROLE.STOCKER)
                return res.status(403).json(null);
            if (status) {
                item.products.map(async (product) => {
                    let statistical = product.product.statistical;
                    statistical[product.productType] += product.quantity;
                    await Product.update({_id: product.product._id}, {$set: {statistical: statistical}});
                });
            }
            await PurchaseOrder.update({_id: id, warehouseId: user.warehouseId},
                {
                    status: (status == 'true') ? "accepted" : "rejected",
                    updatedBy: user.id
                });
        }

        return res.status(200).json(item);
    } catch (err) {
        return next(err);
    }
}

async function getAssignees(req, res, next) {

    const {PurchaseOrder, User} = req.app.get('models');
    const id = get(req.query, 'id', null);
    const user = req.user;
    let role = "repair";
    try {
        if (id) {
            const item = await PurchaseOrder.findById(id);
            if (!item) return res.status(404).json({});
        }
        switch (user.role) {
            case "user":
                role = "repair";
                break;
            case "repair":
                role = "technical";
                break;
            case "technical":
                role = "stocker";
                break;
        }
        console.log(user.role);
        const listUser = await User.find({"warehouseId": user.warehouseId, "role": role});
        return res.status(200).json(listUser);
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
    invoiceManagement,
    getAssignees
};

export {
    PurchaseOrderController
};
