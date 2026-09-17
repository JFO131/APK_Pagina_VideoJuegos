const db = require('../config/db');

// GET /api/juegos → devuelve todos los videojuegos
function obtenerTodos(req, res) {
  const juegos = db.prepare('SELECT * FROM videojuegos').all();
  res.json(juegos);
}

// GET /api/juegos/:id → devuelve un solo videojuego
function obtenerPorId(req, res) {
  const { id } = req.params;
  const juego = db.prepare('SELECT * FROM videojuegos WHERE id = ?').get(id);

  if (!juego) {
    return res.status(404).json({ mensaje: 'Videojuego no encontrado' });
  }

  res.json(juego);
}

module.exports = { obtenerTodos, obtenerPorId };
