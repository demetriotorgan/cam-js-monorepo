require('dotenv').config();

const cloudinary = require('../config/cloudinary');

async function testarUpload() {

    try {

        const resultado = await cloudinary.uploader.upload(
            './test/teste.png',
            {
                folder: 'camera-js'
            }
        );

        console.log('Upload realizado com sucesso!');
        console.log('URL:', resultado.secure_url);
        console.log('Public ID:', resultado.public_id);

    } catch (error) {

        console.error('Erro no upload');
        console.error(error);

    }

}

testarUpload();