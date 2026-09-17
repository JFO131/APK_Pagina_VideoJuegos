const db = require('../config/db');

// POST /api/carrito/sincronizar
// Recibe los cambios del carrito hechos en el celular y los aplica en el servidor.
function sincronizar(req, res) {
  const usuarioId = req.usuarioId;
  const { items } = req.body;

  if (!Array.isArray(items)) {
    return res.status(400).json({ mensaje: 'Se espera un arreglo de items' });
  }

  // "ON CONFLICT ... DO UPDATE" es la clave para evitar duplicados:
  // si ya existe una fila con ese local_id, actualiza la cantidad
  // en vez de insertar una fila nueva.
  const guardarOActualizar = db.prepare(`
    INSERT INTO carrito (usuario_id, videojuego_id, cantidad, local_id)
    VALUES (@usuario_id, @videojuego_id, @cantidad, @local_id)
    ON CONFLICT(local_id) DO UPDATE SET cantidad = excluded.cantidad
  `);

  const eliminar = db.prepare('DELETE FROM carrito WHERE local_id = ? AND usuario_id = ?');

  // Transacción: o se aplican todos los cambios, o ninguno (evita datos a medias)
  const procesarTodos = db.transaction((lista) => {
    for (const item of lista) {
      if (item.eliminado) {
        eliminar.run(item.local_id, usuarioId);
      } else {
        guardarOActualizar.run({
          usuario_id: usuarioId,
          videojuego_id: item.videojuego_id,
          cantidad: item.cantidad,
          local_id: item.local_id,
        });
      }
    }
  });

  procesarTodos(items);

  res.json({
    mensaje: 'Carrito sincronizado correctamente',
    localIdsSincronizados: items.map((i) => i.local_id),
  });
}

// GET /api/carrito → útil para verificar en Postman que la sincronización sí guardó los datos
function obtenerCarrito(req, res) {
  const usuarioId = req.usuarioId;

  const carrito = db.prepare(`
    SELECT c.*, v.nombre, v.imagen, v.precio AS precio_actual
    FROM carrito c
    JOIN videojuegos v ON v.id = c.videojuego_id
    WHERE c.usuario_id = ?
  `).all(usuarioId);

  res.json(carrito);
}

module.exports = { sincronizar, obtenerCarrito };