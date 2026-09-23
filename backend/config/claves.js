// Clave usada para firmar y verificar los tokens de sesión (JWT).
// Se toma desde variables de entorno para no dejar secretos en el código.

module.exports = {
  CLAVE_SECRETA: process.env.CLAVE_SECRETA || 'clave-secreta-12345',
};