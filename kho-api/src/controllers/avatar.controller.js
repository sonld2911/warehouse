'use strict';

import sharp from 'sharp';
import fs from 'fs-extra';
import { CONFIG } from '../config';

async function upload(req, res, next) {

    const { file } = req;

    if (!file) {
        // TODO: handle error
        return next(new Error());
    }

    const avatarPath = `${CONFIG.AVATAR_UPLOAD_PATH}/${file.filename}`;

    try {
        // resize, convert to jpg and save to avatar path
        await sharp(file.path)
            .resize({
                width: 200,
                height: 200,
                fit: 'cover',
                position: 'centre',
            })
            .toFormat('jpg')
            .toFile(avatarPath);

        // delete original file
        await fs.remove(file.path);

        return res.json({
            filename: file.filename,
            path: avatarPath,
        });
    } catch (err) {
        return next(err);
    }
}


const AvatarController = {
    upload,
};

export {
    AvatarController,
};
