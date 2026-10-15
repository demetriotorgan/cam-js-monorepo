const mongoose = require('mongoose');

const fotoSchema = new mongoose.Schema(
    {
        nome: {
            type: String,
            required: true
        },

        idade: {
            type: Number,
            required: true
        },

        foto: {
            url: {
                type: String,
                required: true
            },

            publicId: {
                type: String,
                required: true
            }
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model('Foto', fotoSchema);