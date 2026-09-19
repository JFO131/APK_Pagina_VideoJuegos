// routes/auth.routes.js
const express = require('express');
const router = express.Router();
const verificarToken = require('../middlewares/auth.middleware');
const { registrar, iniciarSesion, actualizarPerfil, cambiarContrasena } = require('../controllers/auth.controller');

router.post('/registro', registrar);
router.post('/login', iniciarSesion);
router.put('/perfil', verificarToken, actualizarPerfil);
router.put('/contrasena', verificarToken, cambiarContrasena);

module.exports = router;