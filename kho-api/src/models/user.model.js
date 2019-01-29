import mongoose from 'mongoose';
import mongoosePaginatePlugin from 'mongoose-paginate-v2';
import uniqueValidator from 'mongoose-unique-validator';
import { CONFIG } from '../config';
import bcrypt from 'bcrypt-nodejs';
import jwt from 'jsonwebtoken';
import { values } from 'lodash';
import { GENDER, ROLE } from '../enums';

const SALT_WORK_FACTOR = 10;

const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        unique: true,
        required: true,
        trim: true,
    },
    email: {
        type: String,
        unique: true,
        required: true,
        lowercase: true,
        trim: true,
    },
    password: {
        type: String,
    },
    name: {
        type: String,
        trim: true,
    },
    gender: {
        type: String,
        enum: values(GENDER),
    },
    isActive: {
        type: Boolean,
        default: true,
    },
    role: {
        type: String,
        enum: values(ROLE),
        default: ROLE.USER,
    },
    warehouseId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Warehouse',
        required: false,
        default: null,
    },
}, { timestamps: true });

UserSchema.plugin(mongoosePaginatePlugin);
UserSchema.plugin(uniqueValidator);

/**
 * Helper method for validating user's password.
 */
UserSchema.methods.comparePassword =
    function comparePassword(candidatePassword) {
        return new Promise((resolve) => {
            bcrypt.compare(candidatePassword, this.password,
                (err, isMatched) => {
                    return resolve(isMatched);
                },
            );
        });
    };

/**
 * Helper method for generate access token
 */
UserSchema.methods.generateJWT = function generateJWT() {
    const payload = { id: this.id };

    const options = { expiresIn: CONFIG.JWT_EXPIRATION };

    return jwt.sign(payload, CONFIG.JWT_ENCRYPTION, options);
};

UserSchema.methods.hasRole = function hasRole(name) {
    return this.role === name;
};

/**
 * Helper method for find a user by email
 * @param {String} email
 */
UserSchema.statics.findByEmail = function findByEmail(email) {
    return this.findOne({ email });
};

/**
 * Helper method for find a user by username
 * @param username
 */
UserSchema.statics.findByUsername = function findByUsername(username) {
    return this.findOne({ username });
};
UserSchema.statics.findByRoleAndWarehouseId = function findBytrungtn(role, warehouseId) {
    return this.find({role: role, warehouseId:warehouseId});
};
UserSchema.statics.findByIdAndRoleAndWarehouseId = function findBytrungtn(id, role, warehouseId) {
    return this.find({id: id, role: role, warehouseId:warehouseId});
};
UserSchema.set('toJSON', {
    transform: function (doc, ret) {
        return mappingResponse(ret);
    },
});

/**
 * BEFORE SAVE MIDDLEWARE
 */
UserSchema.pre('save', function(next) {
    const self = this;
    if (!self.isModified('password')) {
        return next();
    }

    bcrypt.genSalt(SALT_WORK_FACTOR, function (err, salt) {
        if (err) return next(err);

        bcrypt.hash(self.password, salt, null, function (err, hash) {
            if (err) return next(err);

            self.password = hash;
            next();
        });
    });
});

function mappingResponse(props = {}) {
    const data = {
        id: props._id,
        username: props.username,
        email: props.email,
        name: props.name,
        gender: props.gender,
        role: props.role,
        is_active: props.isActive,
        created_at: props.createdAt,
        updated_at: props.updatedAt,
        warehouse: props.warehouseId,
    };

    return data;
}

const User = mongoose.model('User', UserSchema);

export {
    User,
};
