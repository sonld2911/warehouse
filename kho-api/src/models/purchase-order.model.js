import mongoose from 'mongoose';
import mongoosePaginatePlugin from 'mongoose-paginate-v2';
import { values, omit, sumBy } from 'lodash';
import {
    PRODUCT_TYPES,
    PURCHASE_ORDER_STATUS,
    PURCHASE_ORDER_TYPES,
} from '../enums';

const PurchaseOrderSchema = new mongoose.Schema({
    areas: String,
    location: String,
    subtotal: {
        type: Number,
        default: 0,
        min: 0,
    },
    assignees: {},
    managerDepartment: String,
    products: [{
        product: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Product',
        },
        price: {
            type: Number,
            min: 0,
            default: 0,
            required: true,
        },
        quantity: {
            type: Number,
            min: 0,
            default: 0,
            required: true,
        },
        productType: {
            type: String,
            enum: values(PRODUCT_TYPES),
            required: true,
            default: PRODUCT_TYPES.NEW,
        },
        amount: {
            type: Number,
            min: 0,
            default: 0,
        },
    }],
    inputDate: {
        type: Date,
        /*required: true,*/
        /*default: new Date(),*/
    },
    outputDate: {
        type: Date,
        /*required: false,*/
    },
    orderType: {
        type: String,
        enum: values(PURCHASE_ORDER_TYPES),
        required: true,
    },
    status: {
        type: String,
        enum: values(PURCHASE_ORDER_STATUS),
        required: true,
        default: PURCHASE_ORDER_STATUS.PENDING,
    },
    warehouseId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Warehouse',
        required: true,
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        default: null,
    },
    updatedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        default: null,
    },
}, {
    timestamps: true,
});

PurchaseOrderSchema.plugin(mongoosePaginatePlugin);

PurchaseOrderSchema.set('toJSON', {
    transform: function (doc, props) {

        props.id = props._id;

        props.products = props.products.map(product => {
            product.id = product._id;
            product = omit(product, ['_id']);

            return product;
        });

        props = omit(props, ['_id', '__v']);

        return props;
    },
});

PurchaseOrderSchema.pre('find', function () {
    this.populate('products.product');
});

PurchaseOrderSchema.pre('save', function (next) {
    this.products = this.products.map(product => {
        product.price = parseInt(product.price, 10);
        product.quantity = parseInt(product.quantity, 10);
        product.amount = product.price * product.quantity;

        return product;
    });

    this.subtotal = sumBy(this.products, 'amount');

    next();
});

PurchaseOrderSchema.post('save', async function (document, next) {
    await document.populate('products.product').execPopulate();

    next();
});

const PurchaseOrder = mongoose.model('PurchaseOrder', PurchaseOrderSchema);

export {
    PurchaseOrder,
};
