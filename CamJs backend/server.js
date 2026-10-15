const express = require('express');
const cors = require('cors');
require('dotenv').config();

const connectDB = require('./config/db');
const fotoRoutes = require('./routes/fotoRoutes');

const app = express();
app.use(cors());
app.use(express.json());

connectDB();

app.get('/', (req,res)=>{
    res.json({mensagem:'API CamJS rodando'});    
});

app.use('/api', fotoRoutes);

if(process.env.NODE_ENV !== 'production'){
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, ()=> console.log(`Servidor rodando na porta ${PORT}`));
}

module.exports = app;