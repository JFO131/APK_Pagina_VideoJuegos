// Aquí abrimos la conexión a la base de datos SQLite.
// better-sqlite3 crea el archivo tienda.db automáticamente si no existe.

const Database = require('better-sqlite3');
const path = require('path');

const rutaBaseDeDatos = path.join(__dirname, '..', 'database', 'tienda.db');

const db = new Database(rutaBaseDeDatos);

// Esto mejora el rendimiento y evita bloqueos cuando varias
// operaciones leen/escriben casi al mismo tiempo.
db.pragma('journal_mode = WAL');

module.exports = db;
