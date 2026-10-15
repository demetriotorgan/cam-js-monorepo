require('dotenv').config();

const cloudinary = require('../config/cloudinary');

const uploadImagem = async (buffer) => {

    return new Promise((resolve, reject) => {

        const stream = cloudinary.uploader.upload_stream(
            {
                folder: 'camera-js'
            },
            (error, result) => {

                if (error) {
                    return reject(error);
                }

                resolve({
                    url: result.secure_url,
                    publicId: result.public_id
                });

            }
        );

        stream.end(buffer);

    });

};

module.exports = uploadImagem;