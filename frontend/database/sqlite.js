// database/sqlite.js
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

export default db;