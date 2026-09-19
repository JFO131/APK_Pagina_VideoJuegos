const db = require('../config/db');

// POST /api/compras
// Registra una compra completa: la cabecera (compras) y sus productos (detalle_compras).
// También vacía el carrito del usuario en el servidor, porque ya se convirtió en una compra.
function crearCompra(req, res) {
  const usuarioId = req.usuarioId;
  const { items } = req.body; // [{ videojuego_id, cantidad, precio_unitario }]

  if (!Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ mensaje: 'El carrito está vacío' });
  }

  const total = items.reduce((suma, item) => suma + item.precio_unitario * item.cantidad, 0);

  const insertarCompra = db.prepare(
    'INSERT INTO compras (usuario_id, total) VALUES (?, ?)'
  );
  const insertarDetalle = db.prepare(`
    INSERT INTO detalle_compras (compra_id, videojuego_id, cantidad, precio_unitario)
    VALUES (?, ?, ?, ?)
  `);
  const vaciarCarrito = db.prepare('DELETE FROM carrito WHERE usuario_id = ?');

  // Todo esto pasa como una sola transacción: si algo falla,
  // no queda una compra registrada a medias.
  const registrarCompraCompleta = db.transaction(() => {
    const resultado = insertarCompra.run(usuarioId, total);
    const compraId = resultado.lastInsertRowid;

    for (const item of items) {
      insertarDetalle.run(compraId, item.videojuego_id, item.cantidad, item.precio_unitario);
    }

    vaciarCarrito.run(usuarioId);

    return compraId;
  });

  const compraId = registrarCompraCompleta();

  res.status(201).json({
    mensaje: 'Compra registrada correctamente',
    compraId,
    total,
  });
}

// GET /api/compras → historial de compras del usuario logueado
function obtenerCompras(req, res) {
  const usuarioId = req.usuarioId;

  const compras = db.prepare(
    'SELECT * FROM compras WHERE usuario_id = ? ORDER BY fecha DESC'
  ).all(usuarioId);

  const detalleStmt = db.prepare(`
    SELECT d.*, v.nombre, v.imagen
    FROM detalle_compras d
    JOIN videojuegos v ON v.id = d.videojuego_id
    WHERE d.compra_id = ?
  `);

  const comprasConDetalle = compras.map((compra) => ({
    ...compra,
    productos: detalleStmt.all(compra.id),
  }));

  res.json(comprasConDetalle);
}

module.exports = { crearCompra, obtenerCompras };