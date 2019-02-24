'use strict';

import { get, omitBy, isNil, sumBy } from 'lodash';

import { DEFAULT_PAGE_LIMIT } from '../enums';
import { now } from 'moment';
import { stat } from 'fs';

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
        appId: '665346',
        key: 'bbe0eadeb38f6154df71',
        secret: 'b04faba27d6ad9ad5bb0',
        cluster: 'ap1',
        encrypted: true
    });

    pusher.trigger(to, 'post_updated',data);
}

async function invoiceManagement(req, res, next){
    const { PurchaseOrder, User } = req.app.get('models');
    const user = req.user;
    try {
        const items = await PurchaseOrder.aggregate([
            { $match: {warehouseId: user.warehouseId} },
            {$project:{status: 1, orderType: 1}}
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
            data[item.orderType][item.status]+=1;
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
    const { PurchaseOrder, User } = req.app.get('models');
    const { id } = req.params;
    try {
        const item = await PurchaseOrder
            .findById(id)
            .populate('products.product');
        if (!item) {
            return next('error 404 product not found');
        }
        if (item.orderType == "out"){
            if (item.assignees.user.id){
                let user = await User.findById(item.assignees.user.id);
                item.assignees.user["name"] = user.name;
            }else
                item.assignees.user["name"] = "";
            if (item.assignees.repair.id){
                let repair = await User.findById(item.assignees.repair.id);
                item.assignees.repair["name"] = repair.name;
            }else
                item.assignees.repair["name"] = "";
            if (item.assignees.technical.id){
                let technical = await User.findById(item.assignees.technical.id);
                item.assignees.technical["name"] = technical.name;
            }else
                item.assignees.technical["name"] = "";
            if (item.assignees.stocker.id){
                let stocker = await User.findById(item.assignees.stocker.id);
                item.assignees.stocker["name"] = stocker.name;
            }else
                item.assignees.stocker["name"] = "";
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
    const assignees = get(req.body, 'assignees', null);
    const data = req.body;
    data.warehouseId = user.warehouseId;
    data.createdBy = user.id;
    try {
        let user_assignees;
        if (assignees && req.body.orderType == "out")
            user_assignees = await User.findByIdAndRoleAndWarehouseId(assignees, "repair", user.warehouseId);
        else
            user_assignees = await User.findByRoleAndWarehouseId("stocker", user.warehouseId);
        if (!user_assignees)
            return next('error 404 assignees not found');
        data.assignees = {
            user: {id: user.id, status: "accepted", dateTime: new Date()},
            repair: {id: assignees, status: "pending", dateTime: ""},
            technical: {id: "", status: "pending", dateTime: ""},
            stocker: {id: "", status: "pending", dateTime: ""}};
        const purchaseOrder = await PurchaseOrder.create(data);
        const badge = await PurchaseOrder.find({'status': 'pending'}).count();
        // TODO: handle response format
        user_assignees.map((user)=>{sendNotification({
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
    const { PurchaseOrder, Product, User } = req.app.get('models');
    const { id } = req.params;
    const user = req.user;
    const status = get(req.query, 'status', false);
    const assignees = get(req.query, 'assignees', null);
    try {
        const item = await PurchaseOrder.findById(id).populate('products.product');
        if (!item || item.status != "pending") return res.status(404).json({});
       
        if (item.orderType == "out"){
            let listAssignees = item.assignees;
            let output = {};
            switch (user.role) {
                case "repair":
                    if (assignees && user.id == listAssignees.repair.id &&  listAssignees.repair.status == "pending")
                        listAssignees.repair = {
                                status: (status == 'true')?"accepted":"rejected",
                                dateTime: new Date()
                                }
                    else
                        return res.status(400).json({});
                    listAssignees.technical = {id: assignees, status: "pending", dateTime: new Date()}
                    output = {
                        assignees: listAssignees
                    }
                    user_assignees = await User.findByIdAndRoleAndWarehouseId(assignees, "technical", user.warehouseId);
                    user_assignees.map((user)=>{sendNotification({
                        purchaseOrderId: id,
                        badge: 0,
                        title: "Bạn có 1 tin nhắn mới",
                        body: 'Có một đơn chờ chuyệt'
                    }, user.username)});
                    break;
                case "technical":
                    if (user.id = listAssignees.technical.id  && listAssignees.technical.status == "pending")
                        listAssignees.technical = {
                                status: (status == 'true')?"accepted":"rejected",
                                dateTime: new Date()
                            }
                    else
                        return res.status(400).json({});
                    if (status != 'true'){
                        output = {
                            status: "rejected",
                        };
                        break;
                    }
                    listAssignees.stocker = {id: assignees, status: "pending", dateTime: new Date()}
                    output = {
                        assignees: listAssignees
                    };
                    user_assignees = await User.findByIdAndRoleAndWarehouseId(assignees, "stocker", user.warehouseId);
                    user_assignees.map((user)=>{sendNotification({
                        purchaseOrderId: id,
                        badge: 0,
                        title: "Bạn có 1 tin nhắn mới",
                        body: 'Có một đơn chờ chuyệt'
                    }, user.username)});
                    break;
                case "stocker":
                    if (user.id = listAssignees.stocker.id  && listAssignees.stocker.status == "pending")
                        listAssignees.stocker = {
                                status: (status == 'true')?"accepted":"rejected",
                                dateTime: new Date()
                            };
                    else
                        return res.status(400).json({});
                    output = {
                        status: (status == 'true')?"accepted":"rejected",
                        assignees: listAssignees
                    };
                    if(status){
                        item.products.map( async (product)=>{
                            let statistical = product.product.statistical;
                            let calculator = statistical[product.productType] - product.quantity;
                            if(calculator<0) return res.status(400).json({});
                            statistical[product.productType]-=product.quantity;
                            await Product.update({_id: product.product._id},{$set: {statistical: statistical}});
                        });
                    }
                    break;
            }
            console.log(assignees);
            await PurchaseOrder.update({_id: id, warehouseId: user.warehouseId}, output);
            }
        else{
            if(status){
                item.products.map( async (product)=>{
                    let statistical = product.product.statistical;
                    // else{
                    //     // let calculator = statistical[product.productType] - product.quantity;
                    //     // if(calculator<0) return res.status(400).json({});
                    //     // statistical[product.productType]-=product.quantity;
                    // }
                    statistical[product.productType]+=product.quantity;
                    await Product.update({_id: product.product._id},{$set: {statistical: statistical}});
                });
            }
            await PurchaseOrder.update({_id: id, warehouseId: user.warehouseId},
                {
                    status: (status == 'true')?"accepted":"rejected",
                    updatedBy: user.id
                });
        }
           
        return res.status(204).json(item);
    } catch (err) {
        return next(err);
    }
}
async function getAssignees(req, res, next){
    
    const { PurchaseOrder, User } = req.app.get('models');
    const id = get(req.query, 'id', null);
    const user = req.user;
    let role = "repair";
    try {
        if (id){
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
