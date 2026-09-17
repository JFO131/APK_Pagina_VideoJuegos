const express = require('express');
const router = express.Router();
const verificarToken = require('../middlewares/auth.middleware');
const { sincronizar, obtenerCarrito } = require('../controllers/carrito.controller');

router.post('/sincronizar', verificarToken, sincronizar);
router.get('/', verificarToken, obtenerCarrito);

module.exports = router;