// database/sqlite.js
import * as SQLite from 'expo-sqlite';

const db = SQLite.openDatabaseSync('tienda_local.db');

export function inicializarBaseLocal() {
  db.execSync(`
    CREATE TABLE IF NOT EXISTS videojuegos_local (
      id INTEGER PRIMARY KEY,
      nombre TEXT,
      imagen TEXT,
      genero TEXT,
      precio REAL,
      descripcion TEXT
    );

    CREATE TABLE IF NOT EXISTS carrito_local (
      local_id TEXT PRIMARY KEY,
      videojuego_id INTEGER,
      nombre TEXT,
      imagen TEXT,
      genero TEXT,
      precio REAL,
      cantidad INTEGER,
      sincronizado INTEGER DEFAULT 0,
      eliminado INTEGER DEFAULT 0
    );

    CREATE TABLE IF NOT EXISTS compras_pendientes (
      local_id TEXT PRIMARY KEY,
      payload TEXT NOT NULL,
      sincronizado INTEGER DEFAULT 0,
      creado_en TEXT DEFAULT CURRENT_TIMESTAMP
    );
  `);

  // Si la app ya existía antes de agregar "genero", la agregamos ahora.
  // Si ya existe, SQLite lanza un error que simplemente ignoramos.
  try { db.execSync('ALTER TABLE videojuegos_local ADD COLUMN genero TEXT'); } catch (e) {}
  try { db.execSync('ALTER TABLE carrito_local ADD COLUMN genero TEXT'); } catch (e) {}
}

function generarLocalId() {
  return `local_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
}

export function guardarCatalogoLocal(juegos) {
  db.execSync('DELETE FROM videojuegos_local;');

  const insertar = db.prepareSync(
    `INSERT INTO videojuegos_local (id, nombre, imagen, genero, precio, descripcion)
     VALUES (?, ?, ?, ?, ?, ?)`
  );

  for (const juego of juegos) {
    insertar.executeSync([juego.id, juego.nombre, juego.imagen, juego.genero, juego.precio, juego.descripcion]);
  }

  insertar.finalizeSync();
}

export function obtenerCatalogoLocal() {
  return db.getAllSync('SELECT * FROM videojuegos_local;');
}

export function agregarAlCarritoLocal(juego) {
  const existente = db.getFirstSync(
    'SELECT * FROM carrito_local WHERE videojuego_id = ? AND eliminado = 0',
    [juego.id]
  );

  if (existente) {
    db.runSync(
      'UPDATE carrito_local SET cantidad = cantidad + 1, sincronizado = 0 WHERE local_id = ?',
      [existente.local_id]
    );
    return;
  }

  db.runSync(
    `INSERT INTO carrito_local (local_id, videojuego_id, nombre, imagen, genero, precio, cantidad, sincronizado, eliminado)
     VALUES (?, ?, ?, ?, ?, ?, 1, 0, 0)`,
    [generarLocalId(), juego.id, juego.nombre, juego.imagen, juego.genero, juego.precio]
  );
}

export function obtenerCarritoLocal() {
  return db.getAllSync('SELECT * FROM carrito_local WHERE eliminado = 0');
}

export function actualizarCantidadLocal(localId, nuevaCantidad) {
  if (nuevaCantidad <= 0) {
    eliminarDelCarritoLocal(localId);
    return;
  }
  db.runSync('UPDATE carrito_local SET cantidad = ?, sincronizado = 0 WHERE local_id = ?', [nuevaCantidad, localId]);
}

export function eliminarDelCarritoLocal(localId) {
  db.runSync('UPDATE carrito_local SET eliminado = 1, sincronizado = 0 WHERE local_id = ?', [localId]);
}

export function vaciarCarritoLocal() {
  db.runSync('DELETE FROM carrito_local');
}

export function obtenerCarritoNoSincronizado() {
  return db.getAllSync('SELECT * FROM carrito_local WHERE sincronizado = 0');
}

export function marcarCarritoComoSincronizado(localIds) {
  const marcar = db.prepareSync('UPDATE carrito_local SET sincronizado = 1 WHERE local_id = ?');
  for (const id of localIds) marcar.executeSync([id]);
  marcar.finalizeSync();
}

export function eliminarFilasMarcadasComoEliminadas() {
  db.runSync('DELETE FROM carrito_local WHERE eliminado = 1 AND sincronizado = 1');
}

export function guardarCompraPendienteLocal(compra) {
  const payload = JSON.stringify(compra);
  db.runSync(
    'INSERT OR REPLACE INTO compras_pendientes (local_id, payload, sincronizado) VALUES (?, ?, 0)',
    [compra.local_id, payload]
  );
}

export function obtenerComprasPendientes() {
  return db.getAllSync('SELECT * FROM compras_pendientes WHERE sincronizado = 0 ORDER BY creado_en ASC');
}

export function marcarCompraPendienteComoSincronizada(localId) {
  db.runSync('UPDATE compras_pendientes SET sincronizado = 1 WHERE local_id = ?', [localId]);
}

export function eliminarComprasPendientesSincronizadas() {
  db.runSync('DELETE FROM compras_pendientes WHERE sincronizado = 1');
}

export default db;