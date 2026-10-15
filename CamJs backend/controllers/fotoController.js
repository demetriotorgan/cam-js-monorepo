const Foto = require('../models/Foto');
const uploadImagem = require('../services/cloudinaryService');

const criarFoto = async (req, res) => {

    try {

        const { nome, idade } = req.body;

        const resultado = await uploadImagem(req.file.buffer);

        const foto = await Foto.create({
            nome,
            idade,
            foto: {
                url: resultado.url,
                publicId: resultado.publicId
            }
        });

        res.status(201).json(foto);

    } catch (error) {

        res.status(500).json({
            erro: error.message
        });

    }

};

const listarFotos = async (req, res) => {
    try {

        const fotos = await Foto.find().sort({ createdAt: -1 });

        res.json(fotos);

    } catch (error) {

        res.status(500).json({
            erro: error.message
        });

    }
};

const limparFotos = async (req, res) => {
    try {

        const resultado = await Foto.deleteMany({});

        res.status(200).json({
            mensagem: "Todas as fotos foram removidas.",
            totalRemovidas: resultado.deletedCount
        });

    } catch (error) {

        res.status(500).json({
            erro: error.message
        });

    }
};



module.exports = {
    criarFoto,
    listarFotos,
    limparFotos
};