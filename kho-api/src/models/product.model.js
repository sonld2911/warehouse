'use strict';

import mongoose from 'mongoose';
import uniqueValidator from 'mongoose-unique-validator';
import mongoosePaginatePlugin from 'mongoose-paginate-v2';
import { omit } from 'lodash';

const ProductSchema = new mongoose.Schema({
    code: {
        type: String,
        required: true,
        trim: true,
    },
    name: {
        type: String,
        required: true,
        trim: true,

    },
    description: {
        type: String,
        trim: true,
        default: '',
    },
    technicalSpecifications: {
        type: String,
        trim: true,
        default: '',
    },
    unit: {
        type: String,
        trim: true,
        default: '',
    },
    kind: {
        type: String,
        trim: true,
        default: '',
    },
    manufacturer: {
        type: String,
        trim: true,
        default: '',
    },
    machinePart: {
        type: String,
        trim: true,
        default: '',
    },
    warehouseId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Warehouse',
        required: false,
    },
    statistical: {
        new: {
            type: Number,
            min: 0,
            default: 0,
            required: true,
        },
        recovery: {
            type: Number,
            min: 0,
            default: 0,
            required: true,
        },
        guarantee:  {
            type: Number,
            min: 0,
            default: 0,
            required: true,
        },
    },
}, { timestamps: true });

ProductSchema.plugin(mongoosePaginatePlugin);
ProductSchema.plugin(uniqueValidator);

ProductSchema.statics.findByProductCode = function findByProductCode(code) {
    return this.findOne({ code });
};

ProductSchema.statics.isProductCodeExists = function isProductCodeExists(
    code, warehouseId,
) {
    return this.findOne({ code, warehouseId });
};

ProductSchema.set('toJSON', {
    virtual: true,
    transform: function (doc, props) {
        props.id = props._id;

        props = omit(props, ['_id', '__v']);

        return props;
    },
});

const Product = mongoose.model('Product', ProductSchema);

export {
    Product,
};
