const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../config/db');

// Esta clave se usa para firmar los tokens. En un proyecto real
// iría en una variable de entorno (.env), pero para el ejemplo
// académico la dejamos aquí para que sea fácil de ver y explicar.
const { CLAVE_SECRETA } = require('../config/claves');

// POST /api/auth/registro
function registrar(req, res) {
  const { nombre, correo, contrasena } = req.body;

  // Validación básica de los campos
  if (!nombre || !correo || !contrasena) {
    return res.status(400).json({ mensaje: 'Todos los campos son obligatorios' });
  }

  if (contrasena.length < 6) {
    return res.status(400).json({ mensaje: 'La contraseña debe tener al menos 6 caracteres' });
  }

  // Verificamos que el correo no esté ya registrado
  const usuarioExistente = db.prepare('SELECT id FROM usuarios WHERE correo = ?').get(correo);
  if (usuarioExistente) {
    return res.status(409).json({ mensaje: 'Ya existe una cuenta con ese correo' });
  }

  // Encriptamos la contraseña antes de guardarla
  const contrasenaEncriptada = bcrypt.hashSync(contrasena, 10);

  const resultado = db.prepare(
    'INSERT INTO usuarios (nombre, correo, contrasena) VALUES (?, ?, ?)'
  ).run(nombre, correo, contrasenaEncriptada);

  res.status(201).json({
    mensaje: 'Usuario registrado correctamente',
    usuarioId: resultado.lastInsertRowid
  });
}

// POST /api/auth/login
function iniciarSesion(req, res) {
  const { correo, contrasena } = req.body;

  if (!correo || !contrasena) {
    return res.status(400).json({ mensaje: 'Correo y contraseña son obligatorios' });
  }

  const usuario = db.prepare('SELECT * FROM usuarios WHERE correo = ?').get(correo);

  if (!usuario) {
    return res.status(401).json({ mensaje: 'Correo o contraseña incorrectos' });
  }

  // Comparamos la contraseña escrita contra el hash guardado
  const contrasenaValida = bcrypt.compareSync(contrasena, usuario.contrasena);

  if (!contrasenaValida) {
    return res.status(401).json({ mensaje: 'Correo o contraseña incorrectos' });
  }

  // Generamos el token que la app va a guardar
  const token = jwt.sign(
    { usuarioId: usuario.id, correo: usuario.correo },
    CLAVE_SECRETA,
    { expiresIn: '7d' }
  );

  res.json({
    mensaje: 'Sesión iniciada correctamente',
    token,
    usuario: { id: usuario.id, nombre: usuario.nombre, correo: usuario.correo }
  });
}

module.exports = { registrar, iniciarSesion };