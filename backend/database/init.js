// database/init.js
// Crea las tablas de la base de datos si todavía no existen,
// y agrega el catálogo de videojuegos de prueba si la tabla está vacía.

const db = require('../config/db');

function obtenerSchemaSql() {
  if (process.env.DATABASE_URL) {
    return `
      CREATE TABLE IF NOT EXISTS usuarios (
        id SERIAL PRIMARY KEY,
        nombre TEXT NOT NULL,
        correo TEXT NOT NULL UNIQUE,
        contrasena TEXT NOT NULL,
        creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS videojuegos (
        id SERIAL PRIMARY KEY,
        nombre TEXT NOT NULL,
        imagen TEXT,
        precio NUMERIC(10,2) NOT NULL,
        genero TEXT,
        descripcion TEXT
      );

      CREATE TABLE IF NOT EXISTS carrito (
        id SERIAL PRIMARY KEY,
        usuario_id INTEGER NOT NULL,
        videojuego_id INTEGER NOT NULL,
        cantidad INTEGER NOT NULL DEFAULT 1,
        FOREIGN KEY (usuario_id) REFERENCES usuarios(id),
        FOREIGN KEY (videojuego_id) REFERENCES videojuegos(id),
        UNIQUE (usuario_id, videojuego_id)
      );

      CREATE TABLE IF NOT EXISTS compras (
        id SERIAL PRIMARY KEY,
        usuario_id INTEGER NOT NULL,
        total NUMERIC(10,2) NOT NULL,
        fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (usuario_id) REFERENCES usuarios(id)
      );

      CREATE TABLE IF NOT EXISTS historial_compras (
        id SERIAL PRIMARY KEY,
        usuario_id INTEGER NOT NULL,
        compra_id INTEGER NOT NULL UNIQUE,
        total NUMERIC(10,2) NOT NULL,
        fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        estado TEXT NOT NULL DEFAULT 'completada',
        FOREIGN KEY (usuario_id) REFERENCES usuarios(id),
        FOREIGN KEY (compra_id) REFERENCES compras(id)
      );

      CREATE INDEX IF NOT EXISTS idx_historial_compras_usuario_fecha
        ON historial_compras (usuario_id, fecha DESC);

      CREATE TABLE IF NOT EXISTS detalle_compras (
        id SERIAL PRIMARY KEY,
        compra_id INTEGER NOT NULL,
        videojuego_id INTEGER NOT NULL,
        cantidad INTEGER NOT NULL,
        precio_unitario NUMERIC(10,2) NOT NULL,
        FOREIGN KEY (compra_id) REFERENCES compras(id),
        FOREIGN KEY (videojuego_id) REFERENCES videojuegos(id)
      );
    `;
  }

  return `
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
      FOREIGN KEY (usuario_id) REFERENCES usuarios(id),
      FOREIGN KEY (videojuego_id) REFERENCES videojuegos(id),
      UNIQUE (usuario_id, videojuego_id)
    );

    CREATE TABLE IF NOT EXISTS compras (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      usuario_id INTEGER NOT NULL,
      total REAL NOT NULL,
      fecha TEXT DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (usuario_id) REFERENCES usuarios(id)
    );

    CREATE TABLE IF NOT EXISTS historial_compras (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      usuario_id INTEGER NOT NULL,
      compra_id INTEGER NOT NULL UNIQUE,
      total REAL NOT NULL,
      fecha TEXT DEFAULT CURRENT_TIMESTAMP,
      estado TEXT NOT NULL DEFAULT 'completada',
      FOREIGN KEY (usuario_id) REFERENCES usuarios(id),
      FOREIGN KEY (compra_id) REFERENCES compras(id)
    );

    CREATE INDEX IF NOT EXISTS idx_historial_compras_usuario_fecha
      ON historial_compras (usuario_id, fecha DESC);

    CREATE TABLE IF NOT EXISTS detalle_compras (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      compra_id INTEGER NOT NULL,
      videojuego_id INTEGER NOT NULL,
      cantidad INTEGER NOT NULL,
      precio_unitario REAL NOT NULL,
      FOREIGN KEY (compra_id) REFERENCES compras(id),
      FOREIGN KEY (videojuego_id) REFERENCES videojuegos(id)
    );
  `;
}

async function crearTablas() {
  await db.exec(obtenerSchemaSql());
}

async function asegurarMigracionCarrito() {
  if (process.env.DATABASE_URL) {
    await db.exec(`
      WITH duplicados AS (
        SELECT id,
               ROW_NUMBER() OVER (
                 PARTITION BY usuario_id, videojuego_id
                 ORDER BY id
               ) AS orden
        FROM carrito
      )
      DELETE FROM carrito
      WHERE id IN (
        SELECT id FROM duplicados WHERE orden > 1
      );
    `);

    await db.exec(`
      CREATE UNIQUE INDEX IF NOT EXISTS carrito_usuario_videojuego_unico
      ON carrito (usuario_id, videojuego_id);
    `);

    return;
  }

  await db.exec(`
    DELETE FROM carrito
    WHERE rowid NOT IN (
      SELECT MIN(rowid)
      FROM carrito
      GROUP BY usuario_id, videojuego_id
    );
  `);

  await db.exec(`
    CREATE UNIQUE INDEX IF NOT EXISTS carrito_usuario_videojuego_unico
    ON carrito (usuario_id, videojuego_id);
  `);
}

// Genera una URL de portada con el nombre del juego sobre un fondo de color.
// Esto evita usar carátulas oficiales con derechos de autor.
function generarPortada(nombre, colorFondo) {
  const texto = encodeURIComponent(nombre);
  return `https://placehold.co/500x650/${colorFondo}/ffffff?text=${texto}&font=montserrat`;
}

async function insertarDatosDePrueba() {
  const cantidad = await db.prepare('SELECT COUNT(*) AS total FROM videojuegos').get();

  if (cantidad.total > 0) {
    console.log('Ya hay videojuegos en la base de datos, no se insertan de nuevo.');
    return;
  }

  const insertar = db.prepare(`
    INSERT INTO videojuegos (nombre, imagen, precio, genero, descripcion)
    VALUES (?, ?, ?, ?, ?)
  `);

  const colores = [
    '1e3a5f', '5f1e3a', '3a5f1e', '5f3a1e', '1e5f3a', '3a1e5f',
    '2c2c54', '474787', 'aaa69d', '227093', '218c74', 'b33939',
  ];

  const juegos = [
    { nombre: 'Minecraft', genero: 'Sandbox', precio: 26.95, descripcion: 'Construye, explora y sobrevive en un mundo hecho completamente de bloques.' },
    { nombre: 'The Legend of Zelda: Breath of the Wild', genero: 'Aventura', precio: 59.99, descripcion: 'Explora un vasto reino abierto lleno de misterios, templos y criaturas.' },
    { nombre: 'God of War Ragnarök', genero: 'Acción', precio: 59.99, descripcion: 'Kratos y Atreus enfrentan el fin de los tiempos en la mitología nórdica.' },
    { nombre: 'EA Sports FC 24', genero: 'Deportes', precio: 59.99, descripcion: 'El simulador de fútbol más popular, con equipos y ligas de todo el mundo.' },
    { nombre: 'Grand Theft Auto V', genero: 'Acción', precio: 29.99, descripcion: 'Un mundo abierto criminal con tres protagonistas y una ciudad gigante por explorar.' },
    { nombre: 'The Witcher 3: Wild Hunt', genero: 'RPG', precio: 39.99, descripcion: 'Geralt de Rivia busca a su hija adoptiva en un mundo de fantasía oscura.' },
    { nombre: 'Among Us', genero: 'Fiesta', precio: 4.99, descripcion: 'Encuentra al impostor entre la tripulación antes de que sea tarde.' },
    { nombre: 'Fortnite', genero: 'Battle Royale', precio: 0, descripcion: '100 jugadores, una isla, y solo un ganador.' },
    { nombre: 'Call of Duty: Modern Warfare III', genero: 'Shooter', precio: 69.99, descripcion: 'Combate militar moderno con modos campaña, multijugador y zombies.' },
    { nombre: 'Animal Crossing: New Horizons', genero: 'Simulación', precio: 49.99, descripcion: 'Crea tu propia isla y convive con simpáticos vecinos animales.' },
    { nombre: 'Super Mario Odyssey', genero: 'Plataformas', precio: 59.99, descripcion: 'Mario recorre reinos increíbles usando su gorra mágica Cappy.' },
    { nombre: 'Red Dead Redemption 2', genero: 'Acción', precio: 59.99, descripcion: 'La vida de un forajido en el ocaso del viejo oeste americano.' },
    { nombre: 'Stardew Valley', genero: 'Simulación', precio: 14.99, descripcion: 'Hereda una granja abandonada y construye la vida rural que siempre soñaste.' },
    { nombre: 'Hades', genero: 'Roguelike', precio: 24.99, descripcion: 'Escapa del inframundo griego combatiendo una y otra vez contra los dioses.' },
    { nombre: 'Cyberpunk 2077', genero: 'RPG', precio: 49.99, descripcion: 'Sobrevive y triunfa en Night City, una metrópolis obsesionada con el poder.' },
    { nombre: 'Elden Ring', genero: 'RPG', precio: 59.99, descripcion: 'Un vasto mundo de fantasía creado junto al autor de Canción de Hielo y Fuego.' },
    { nombre: 'Mario Kart 8 Deluxe', genero: 'Carreras', precio: 59.99, descripcion: 'Carreras frenéticas con power-ups y personajes de Nintendo.' },
    { nombre: 'Overwatch 2', genero: 'Shooter', precio: 0, descripcion: 'Shooter en equipo con héroes de habilidades únicas.' },
    { nombre: 'League of Legends', genero: 'MOBA', precio: 0, descripcion: 'Dos equipos compiten por destruir el núcleo enemigo en la Grieta del Invocador.' },
    { nombre: 'Valorant', genero: 'Shooter', precio: 0, descripcion: 'Shooter táctico 5v5 con agentes de habilidades especiales.' },
    { nombre: 'Minecraft Dungeons', genero: 'Acción', precio: 19.99, descripcion: 'Un dungeon crawler cooperativo ambientado en el universo de Minecraft.' },
    { nombre: 'Terraria', genero: 'Sandbox', precio: 9.99, descripcion: 'Cava, construye y lucha en un mundo 2D generado aleatoriamente.' },
    { nombre: 'Rocket League', genero: 'Deportes', precio: 19.99, descripcion: 'Fútbol con autos cohete a alta velocidad.' },
    { nombre: 'Hollow Knight', genero: 'Metroidvania', precio: 14.99, descripcion: 'Explora un reino subterráneo en ruinas habitado por insectos.' },
    { nombre: 'Celeste', genero: 'Plataformas', precio: 19.99, descripcion: 'Ayuda a Madeline a escalar una montaña llena de peligros y de sí misma.' },
    { nombre: 'It Takes Two', genero: 'Aventura', precio: 39.99, descripcion: 'Una pareja convertida en muñecos debe cooperar para volver a ser humanos.' },
  ];

  if (process.env.DATABASE_URL) {
    const insertarTodos = db.transaction(async (tx, lista) => {
      for (const [indice, juego] of lista.entries()) {
        await tx.prepare(`
          INSERT INTO videojuegos (nombre, imagen, precio, genero, descripcion)
          VALUES (?, ?, ?, ?, ?)
        `).run(
          juego.nombre,
          generarPortada(juego.nombre, colores[indice % colores.length]),
          juego.precio,
          juego.genero,
          juego.descripcion,
        );
      }
    });

    await insertarTodos(juegos);
    console.log(`${juegos.length} videojuegos de prueba insertados correctamente.`);
    return;
  }

  const insertarTodos = db.transaction((lista) => {
    lista.forEach((juego, indice) => {
      insertar.run(
        juego.nombre,
        generarPortada(juego.nombre, colores[indice % colores.length]),
        juego.precio,
        juego.genero,
        juego.descripcion,
      );
    });
  });

  insertarTodos(juegos);
  console.log(`${juegos.length} videojuegos de prueba insertados correctamente.`);
}

async function inicializarBase() {
  await crearTablas();
  await asegurarMigracionCarrito();
  await insertarDatosDePrueba();
}

module.exports = inicializarBase;
