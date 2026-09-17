// Maneja la base de datos local SQLite del celular.
// Aquí se guarda el catálogo (para verlo offline) y el carrito local.

import * as SQLite from 'expo-sqlite';

// Abre (o crea) el archivo de base de datos local en el celular
const db = SQLite.openDatabaseSync('tienda_local.db');

// Crea las tablas necesarias si todavía no existen.
// La llamamos una vez al arrancar la app.
export function inicializarBaseLocal() {
  db.execSync(`
    CREATE TABLE IF NOT EXISTS videojuegos_local (
      id INTEGER PRIMARY KEY,
      nombre TEXT,
      imagen TEXT,
      precio REAL,
      genero TEXT,
      descripcion TEXT
    );

    CREATE TABLE IF NOT EXISTS carrito_local (
      local_id TEXT PRIMARY KEY,
      videojuego_id INTEGER,
      nombre TEXT,
      imagen TEXT,
      precio REAL,
      cantidad INTEGER,
      sincronizado INTEGER DEFAULT 0,
      eliminado INTEGER DEFAULT 0
    );
  `);
}

// Reemplaza todo el catálogo local con la versión más reciente del servidor.
// Se llama cada vez que hay internet y se trae el catálogo actualizado.
export function guardarCatalogoLocal(juegos) {
  db.execSync('DELETE FROM videojuegos_local;');

  const insertar = db.prepareSync(
    `INSERT INTO videojuegos_local (id, nombre, imagen, precio, genero, descripcion)
     VALUES (?, ?, ?, ?, ?, ?)`
  );

  for (const juego of juegos) {
    insertar.executeSync([
      juego.id,
      juego.nombre,
      juego.imagen,
      juego.precio,
      juego.genero,
      juego.descripcion,
    ]);
  }

  insertar.finalizeSync();
}

// Lee el catálogo guardado localmente (se usa cuando no hay internet)
export function obtenerCatalogoLocal() {
  return db.getAllSync('SELECT * FROM videojuegos_local;');
}

// Genera un identificador único para cada fila del carrito local.
// Lo usamos porque, al estar offline, no tenemos un id del servidor todavía.
function generarLocalId() {
  return `local_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
}

// Agrega un videojuego al carrito local.
// Si el juego ya estaba en el carrito, simplemente suma 1 a la cantidad.
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
    `INSERT INTO carrito_local (local_id, videojuego_id, nombre, imagen, precio, cantidad, sincronizado, eliminado)
     VALUES (?, ?, ?, ?, ?, 1, 0, 0)`,
    [generarLocalId(), juego.id, juego.nombre, juego.imagen, juego.precio]
  );
}

// Devuelve todos los productos del carrito que no han sido eliminados
export function obtenerCarritoLocal() {
  return db.getAllSync('SELECT * FROM carrito_local WHERE eliminado = 0');
}

// Cambia la cantidad de un producto. Si la cantidad llega a 0, lo elimina.
export function actualizarCantidadLocal(localId, nuevaCantidad) {
  if (nuevaCantidad <= 0) {
    eliminarDelCarritoLocal(localId);
    return;
  }

  db.runSync(
    'UPDATE carrito_local SET cantidad = ?, sincronizado = 0 WHERE local_id = ?',
    [nuevaCantidad, localId]
  );
}

// Marca un producto como eliminado (no lo borra físicamente todavía,
// así en la Etapa 6 podemos avisarle al backend que también lo elimine).
export function eliminarDelCarritoLocal(localId) {
  db.runSync(
    'UPDATE carrito_local SET eliminado = 1, sincronizado = 0 WHERE local_id = ?',
    [localId]
  );
}

// Vacía el carrito por completo (lo usaremos después de confirmar una compra)
export function vaciarCarritoLocal() {
  db.runSync('DELETE FROM carrito_local');
}

// Trae las filas del carrito que todavía no se han enviado al servidor
export function obtenerCarritoNoSincronizado() {
  return db.getAllSync('SELECT * FROM carrito_local WHERE sincronizado = 0');
}

// Marca como sincronizadas las filas que el servidor ya confirmó
export function marcarCarritoComoSincronizado(localIds) {
  const marcar = db.prepareSync('UPDATE carrito_local SET sincronizado = 1 WHERE local_id = ?');
  for (const id of localIds) {
    marcar.executeSync([id]);
  }
  marcar.finalizeSync();
}

// Borra físicamente del celular las filas que ya se eliminaron
// tanto localmente como en el servidor (ya cumplieron su propósito).
export function eliminarFilasMarcadasComoEliminadas() {
  db.runSync('DELETE FROM carrito_local WHERE eliminado = 1 AND sincronizado = 1');
}

export default db;