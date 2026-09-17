// routes/juegos.routes.js
const express = require('express');
const router = express.Router();
const { obtenerTodos, obtenerPorId } = require('../controllers/juegos.controller');

router.get('/', obtenerTodos);
router.get('/:id', obtenerPorId);

module.exports = router;
