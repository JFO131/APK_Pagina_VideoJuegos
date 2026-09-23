const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../config/db');

// Esta clave se usa para firmar los tokens. En un proyecto real
// iría en una variable de entorno (.env), pero para el ejemplo
// académico la dejamos aquí para que sea fácil de ver y explicar.
const { CLAVE_SECRETA } = require('../config/claves');

// POST /api/auth/registro
async function registrar(req, res) {
  const { nombre, correo, contrasena } = req.body;

  if (!nombre || !correo || !contrasena) {
    return res.status(400).json({ mensaje: 'Todos los campos son obligatorios' });
  }

  if (contrasena.length < 6) {
    return res.status(400).json({ mensaje: 'La contraseña debe tener al menos 6 caracteres' });
  }

  const usuarioExistente = await db.prepare('SELECT id FROM usuarios WHERE correo = ?').get(correo);
  if (usuarioExistente) {
    return res.status(409).json({ mensaje: 'Ya existe una cuenta con ese correo' });
  }

  const contrasenaEncriptada = bcrypt.hashSync(contrasena, 10);
  const resultado = await db.prepare(
    'INSERT INTO usuarios (nombre, correo, contrasena) VALUES (?, ?, ?)'
  ).run(nombre, correo, contrasenaEncriptada);

  res.status(201).json({
    mensaje: 'Usuario registrado correctamente',
    usuarioId: resultado.lastInsertRowid,
  });
}

// POST /api/auth/login
async function iniciarSesion(req, res) {
  const { correo, contrasena } = req.body;

  if (!correo || !contrasena) {
    return res.status(400).json({ mensaje: 'Correo y contraseña son obligatorios' });
  }

  const usuario = await db.prepare('SELECT * FROM usuarios WHERE correo = ?').get(correo);

  if (!usuario) {
    return res.status(401).json({ mensaje: 'Correo o contraseña incorrectos' });
  }

  const contrasenaValida = bcrypt.compareSync(contrasena, usuario.contrasena);

  if (!contrasenaValida) {
    return res.status(401).json({ mensaje: 'Correo o contraseña incorrectos' });
  }

  const token = jwt.sign(
    { usuarioId: usuario.id, correo: usuario.correo },
    CLAVE_SECRETA,
    { expiresIn: '7d' }
  );

  res.json({
    mensaje: 'Sesión iniciada correctamente',
    token,
    usuario: { id: usuario.id, nombre: usuario.nombre, correo: usuario.correo },
  });
}

// PUT /api/auth/perfil
async function actualizarPerfil(req, res) {
  const usuarioId = req.usuarioId;
  const { nombre, correo } = req.body;

  if (!nombre || !correo) {
    return res.status(400).json({ mensaje: 'Nombre y correo son obligatorios' });
  }

  const correoEnUso = await db.prepare('SELECT id FROM usuarios WHERE correo = ? AND id != ?').get(correo, usuarioId);
  if (correoEnUso) {
    return res.status(409).json({ mensaje: 'Ese correo ya está en uso por otra cuenta' });
  }

  await db.prepare('UPDATE usuarios SET nombre = ?, correo = ? WHERE id = ?').run(nombre, correo, usuarioId);
  const usuarioActualizado = await db.prepare('SELECT id, nombre, correo FROM usuarios WHERE id = ?').get(usuarioId);

  res.json({ mensaje: 'Perfil actualizado correctamente', usuario: usuarioActualizado });
}

// PUT /api/auth/contrasena
async function cambiarContrasena(req, res) {
  const usuarioId = req.usuarioId;
  const { contrasenaActual, contrasenaNueva } = req.body;

  if (!contrasenaActual || !contrasenaNueva) {
    return res.status(400).json({ mensaje: 'Completa ambos campos de contraseña' });
  }
  if (contrasenaNueva.length < 6) {
    return res.status(400).json({ mensaje: 'La nueva contraseña debe tener al menos 6 caracteres' });
  }

  const usuario = await db.prepare('SELECT * FROM usuarios WHERE id = ?').get(usuarioId);
  const esValida = bcrypt.compareSync(contrasenaActual, usuario.contrasena);
  if (!esValida) {
    return res.status(401).json({ mensaje: 'La contraseña actual es incorrecta' });
  }

  const nuevaEncriptada = bcrypt.hashSync(contrasenaNueva, 10);
  await db.prepare('UPDATE usuarios SET contrasena = ? WHERE id = ?').run(nuevaEncriptada, usuarioId);

  res.json({ mensaje: 'Contraseña actualizada correctamente' });
}

module.exports = { registrar, iniciarSesion, actualizarPerfil, cambiarContrasena };