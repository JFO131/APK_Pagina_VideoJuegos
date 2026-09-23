const db = require('../config/db');

// POST /api/carrito/sincronizar
// Recibe los cambios del carrito hechos en el celular y los aplica en el servidor.
async function sincronizar(req, res) {
  const usuarioId = req.usuarioId;
  const { items } = req.body;

  if (!Array.isArray(items)) {
    return res.status(400).json({ mensaje: 'Se espera un arreglo de items' });
  }

  const guardarOActualizar = db.prepare(`
    INSERT INTO carrito (usuario_id, videojuego_id, cantidad)
    VALUES (?, ?, ?)
    ON CONFLICT (usuario_id, videojuego_id)
    DO UPDATE SET cantidad = excluded.cantidad
  `);

  const eliminar = db.prepare('DELETE FROM carrito WHERE usuario_id = ? AND videojuego_id = ?');

  const procesarTodos = db.transaction(async (lista) => {
    for (const item of lista) {
      if (!item || typeof item.videojuego_id === 'undefined') {
        continue;
      }

      if (item.eliminado) {
        await eliminar.run(usuarioId, item.videojuego_id);
        continue;
      }

      await guardarOActualizar.run(
        usuarioId,
        item.videojuego_id,
        Number(item.cantidad ?? 1)
      );
    }
  });

  await procesarTodos(items);

  res.json({
    mensaje: 'Carrito sincronizado correctamente',
    actualizado: true,
  });
}

// GET /api/carrito → útil para verificar en Postman que la sincronización sí guardó los datos
async function obtenerCarrito(req, res) {
  const usuarioId = req.usuarioId;

  const carrito = await db.prepare(`
    SELECT c.*, v.nombre, v.imagen, v.precio AS precio_actual
    FROM carrito c
    JOIN videojuegos v ON v.id = c.videojuego_id
    WHERE c.usuario_id = ?
  `).all(usuarioId);

  res.json(carrito);
}

module.exports = { sincronizar, obtenerCarrito };