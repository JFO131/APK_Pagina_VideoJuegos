const express = require('express');
const router = express.Router();
const verificarToken = require('../middlewares/auth.middleware');
const { crearCompra, obtenerCompras } = require('../controllers/compras.controller');

router.post('/', verificarToken, crearCompra);
router.get('/', verificarToken, obtenerCompras);

module.exports = router;