const express = require('express');
const router = express.Router();

const upload = require('../middlewares/uploadMiddleware');
const { criarFoto, listarFotos, limparFotos } = require('../controllers/fotoController');

router.post('/postar', upload.single('foto'), criarFoto);
router.get('/listar', listarFotos);
router.delete('/limparfotos', limparFotos);

module.exports = router;