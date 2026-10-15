require('dotenv').config();

const fs = require('fs');

const uploadImagem = require('../services/cloudinaryService');

async function testarBuffer() {

    try {

        // transforma a imagem em Buffer
        const buffer = fs.readFileSync('./test/teste.png');

        const resultado = await uploadImagem(buffer);

        console.log("Upload realizado!");

        console.log(resultado);

    } catch (error) {

        console.error(error);

    }

}

testarBuffer();