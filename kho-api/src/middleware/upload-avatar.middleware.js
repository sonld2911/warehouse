'use strict';

import multer from 'multer';
import path from 'path';
import uuidv1 from 'uuid/v1';
import fs from 'fs-extra';
import { CONFIG } from '../config';

const avatarStorage = multer.diskStorage({
    destination: CONFIG.UPLOAD_TEMP_PATH,
    filename: (req, file, done) => {
        const ext = path.extname(file.originalname.toLowerCase());
        const filename = uuidv1(file.originalname);
        return done(null, `${filename}${ext}`);
    },
});

const options = {
    storage: avatarStorage,
    limits: {
        fileSize: CONFIG.AVATAR_MAX_FILE_SIZE,
    },
    fileFilter: (req, file, done) => {
        const allowedTypes = /jpeg|jpg|png|bmp/;

        const mimeType = allowedTypes.test(file.mimetype);

        const extName = allowedTypes.test(
            path.extname(file.originalname.toLowerCase()),
        );

        if (mimeType && extName) {
            return done(null, true);
        }

        // TODO: handle error
        return done(new Error());
    },
};

(async () => {
    try {
        await fs.ensureDir(`${CONFIG.ROOT_DIR}/${CONFIG.UPLOAD_TEMP_PATH}`);
        await fs.ensureDir(`${CONFIG.ROOT_DIR}/${CONFIG.AVATAR_UPLOAD_PATH}`);
    } catch (err) {
        throw new Error(err);
    }
})();

export const UploadAvatarMiddleware = multer(options).single('avatar');
