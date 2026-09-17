// database/init.js
// Crea las tablas de la base de datos si todavía no existen,
// y agrega videojuegos de prueba si la tabla está vacía.

const db = require('../config/db');

function crearTablas() {
  db.exec(`
    CREATE TABLE IF NOT EXISTS usuarios (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nombre TEXT NOT NULL,
      correo TEXT NOT NULL UNIQUE,
      contrasena TEXT NOT NULL,
      creado_en TEXT DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS videojuegos (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nombre TEXT NOT NULL,
      imagen TEXT,
      precio REAL NOT NULL,
      genero TEXT,
      descripcion TEXT
    );

    CREATE TABLE IF NOT EXISTS carrito (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      usuario_id INTEGER NOT NULL,
      videojuego_id INTEGER NOT NULL,
      cantidad INTEGER NOT NULL DEFAULT 1,
      local_id TEXT UNIQUE,
      FOREIGN KEY (usuario_id) REFERENCES usuarios(id),
      FOREIGN KEY (videojuego_id) REFERENCES videojuegos(id)
    );

    CREATE TABLE IF NOT EXISTS compras (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      usuario_id INTEGER NOT NULL,
      total REAL NOT NULL,
      fecha TEXT DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (usuario_id) REFERENCES usuarios(id)
    );

    CREATE TABLE IF NOT EXISTS detalle_compras (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      compra_id INTEGER NOT NULL,
      videojuego_id INTEGER NOT NULL,
      cantidad INTEGER NOT NULL,
      precio_unitario REAL NOT NULL,
      FOREIGN KEY (compra_id) REFERENCES compras(id),
      FOREIGN KEY (videojuego_id) REFERENCES videojuegos(id)
    );
  `);
}

function insertarDatosDePrueba() {
  const cantidad = db.prepare('SELECT COUNT(*) AS total FROM videojuegos').get();

  if (cantidad.total > 0) {
    console.log('Ya hay videojuegos en la base de datos, no se insertan de nuevo.');
    return;
  }

  const insertar = db.prepare(`
    INSERT INTO videojuegos (nombre, imagen, precio, genero, descripcion)
    VALUES (@nombre, @imagen, @precio, @genero, @descripcion)
  `);

  const juegos = [
    {
      nombre: 'Space Warriors',
      imagen: 'https://picsum.photos/seed/space/300/300',
      precio: 59.99,
      genero: 'Acción',
      descripcion: 'Batallas espaciales en tiempo real contra flotas enemigas.'
    },
    {
      nombre: 'Reinos Perdidos',
      imagen: 'https://picsum.photos/seed/reinos/300/300',
      precio: 49.99,
      genero: 'RPG',
      descripcion: 'Explora un mundo abierto lleno de misiones y criaturas.'
    },
    {
      nombre: 'Velocidad Extrema',
      imagen: 'https://picsum.photos/seed/velocidad/300/300',
      precio: 39.99,
      genero: 'Carreras',
      descripcion: 'Carreras callejeras con autos personalizables.'
    },
    {
      nombre: 'Puzzle Mind',
      imagen: 'https://picsum.photos/seed/puzzle/300/300',
      precio: 14.99,
      genero: 'Puzzle',
      descripcion: 'Rompecabezas relajante con más de 100 niveles.'
    }
  ];

  const insertarTodos = db.transaction((lista) => {
    for (const juego of lista) insertar.run(juego);
  });

  insertarTodos(juegos);
  console.log('Videojuegos de prueba insertados correctamente.');
}

crearTablas();
insertarDatosDePrueba();
