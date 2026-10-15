const mongoose = require('mongoose');

let isConnected = false;

const connectDB = async() =>{
    if(isConnected){
        return
    }
    try {
        const db = await mongoose.connect(process.env.MONGO_URI);
        isConnected = db.connections[0].readyState;
        console.log(`MongoDB conectado ao banco: ${db.connection.name}`);
    } catch (error) {
        console.error('Erro ao conectar ao MongoDB:', error.message);
        process.exit(1);
    }
};

module.exports = connectDB;