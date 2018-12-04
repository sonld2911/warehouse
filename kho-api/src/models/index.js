import { CONFIG } from '../config';
import mongoose from 'mongoose';
import fs from 'fs';
import path from 'path';
import camelCase from 'camelcase';

const basename = path.basename(__filename);

const models = {};

fs.readdirSync(__dirname)
    .filter(file => {
        return (file.indexOf('.') !== 0)
            && (file !== basename) && (file.slice(-3) === '.js');
    })
    .forEach(file => {
        const filename = file.split('.')[0];
        const modelName = camelCase(filename, {pascalCase: true});
        const model = require(`./${file}`);

        models[modelName] = model[modelName];
    });

mongoose.Promise = global.Promise;

function connect() {
    mongoose.connect(CONFIG.MONGODB_URI);

    return mongoose.connection;
}

mongoose.set('useCreateIndex', true);

mongoose.set('useNewUrlParser', true);

const db = connect();

export {
    db,
    connect,
    models,
};
