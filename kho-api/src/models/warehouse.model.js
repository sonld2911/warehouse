'use strict';

import mongoose from 'mongoose';
import mongoosePaginatePlugin from 'mongoose-paginate-v2';

const Schema = mongoose.Schema;

const WarehouseSchema = new Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    isActive: {
        type: Boolean,
        default: true,
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
    }
}, { timestamps: true });

WarehouseSchema.plugin(mongoosePaginatePlugin);

WarehouseSchema.set('toJSON', {
    transform: function (doc, ret) {
        return mappingResponse(ret);
    },
});

function mappingResponse(props) {
    return {
        id: props._id,
        name: props.name,
        created_at: props.createdAt,
        updated_at: props.updatedAt,
        is_active: props.isActive,
        createdBy: props.createdBy,
        updatedBy: props.updatedBy,
    };
}

const Warehouse = mongoose.model('Warehouse', WarehouseSchema);

export {
    Warehouse,
};
