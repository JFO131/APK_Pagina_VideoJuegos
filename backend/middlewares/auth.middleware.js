// Verifica que la petición traiga un token válido antes de continuar.

const jwt = require('jsonwebtoken');
const { CLAVE_SECRETA } = require('../config/claves');

function verificarToken(req, res, next) {
  const encabezado = req.headers.authorization;

  if (!encabezado || !encabezado.startsWith('Bearer ')) {
    return res.status(401).json({ mensaje: 'Token no proporcionado' });
  }

  const token = encabezado.split(' ')[1];

  try {
    const datos = jwt.verify(token, CLAVE_SECRETA);
    req.usuarioId = datos.usuarioId; // queda disponible para el controlador
    next(); // todo bien, continúa hacia el controlador
  } catch (error) {
    return res.status(401).json({ mensaje: 'Token inválido o expirado' });
  }
}

module.exports = verificarToken;