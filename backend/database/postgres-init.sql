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

CREATE UNIQUE INDEX IF NOT EXISTS carrito_usuario_videojuego_unico
ON carrito (usuario_id, videojuego_id);

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

INSERT INTO videojuegos (nombre, imagen, precio, genero, descripcion)
SELECT * FROM (
  VALUES
    ('Minecraft', 'https://placehold.co/500x650/1e3a5f/ffffff?text=Minecraft&font=montserrat', 26.95, 'Sandbox', 'Construye, explora y sobrevive en un mundo hecho completamente de bloques.'),
    ('The Legend of Zelda: Breath of the Wild', 'https://placehold.co/500x650/5f1e3a/ffffff?text=The%20Legend%20of%20Zelda%3A%20Breath%20of%20the%20Wild&font=montserrat', 59.99, 'Aventura', 'Explora un vasto reino abierto lleno de misterios, templos y criaturas.'),
    ('God of War Ragnarök', 'https://placehold.co/500x650/3a5f1e/ffffff?text=God%20of%20War%20Ragnar%C3%B6k&font=montserrat', 59.99, 'Acción', 'Kratos y Atreus enfrentan el fin de los tiempos en la mitología nórdica.'),
    ('EA Sports FC 24', 'https://placehold.co/500x650/5f3a1e/ffffff?text=EA%20Sports%20FC%2024&font=montserrat', 59.99, 'Deportes', 'El simulador de fútbol más popular, con equipos y ligas de todo el mundo.'),
    ('Grand Theft Auto V', 'https://placehold.co/500x650/1e5f3a/ffffff?text=Grand%20Theft%20Auto%20V&font=montserrat', 29.99, 'Acción', 'Un mundo abierto criminal con tres protagonistas y una ciudad gigante por explorar.'),
    ('The Witcher 3: Wild Hunt', 'https://placehold.co/500x650/3a1e5f/ffffff?text=The%20Witcher%203%3A%20Wild%20Hunt&font=montserrat', 39.99, 'RPG', 'Geralt de Rivia busca a su hija adoptiva en un mundo de fantasía oscura.'),
    ('Among Us', 'https://placehold.co/500x650/2c2c54/ffffff?text=Among%20Us&font=montserrat', 4.99, 'Fiesta', 'Encuentra al impostor entre la tripulación antes de que sea tarde.'),
    ('Fortnite', 'https://placehold.co/500x650/474787/ffffff?text=Fortnite&font=montserrat', 0, 'Battle Royale', '100 jugadores, una isla, y solo un ganador.'),
    ('Call of Duty: Modern Warfare III', 'https://placehold.co/500x650/aaa69d/ffffff?text=Call%20of%20Duty%3A%20Modern%20Warfare%20III&font=montserrat', 69.99, 'Shooter', 'Combate militar moderno con modos campaña, multijugador y zombies.'),
    ('Animal Crossing: New Horizons', 'https://placehold.co/500x650/227093/ffffff?text=Animal%20Crossing%3A%20New%20Horizons&font=montserrat', 49.99, 'Simulación', 'Crea tu propia isla y convive con simpáticos vecinos animales.'),
    ('Super Mario Odyssey', 'https://placehold.co/500x650/218c74/ffffff?text=Super%20Mario%20Odyssey&font=montserrat', 59.99, 'Plataformas', 'Mario recorre reinos increíbles usando su gorra mágica Cappy.'),
    ('Red Dead Redemption 2', 'https://placehold.co/500x650/b33939/ffffff?text=Red%20Dead%20Redemption%202&font=montserrat', 59.99, 'Acción', 'La vida de un forajido en el ocaso del viejo oeste americano.'),
    ('Stardew Valley', 'https://placehold.co/500x650/1e3a5f/ffffff?text=Stardew%20Valley&font=montserrat', 14.99, 'Simulación', 'Hereda una granja abandonada y construye la vida rural que siempre soñaste.'),
    ('Hades', 'https://placehold.co/500x650/5f1e3a/ffffff?text=Hades&font=montserrat', 24.99, 'Roguelike', 'Escapa del inframundo griego combatiendo una y otra vez contra los dioses.'),
    ('Cyberpunk 2077', 'https://placehold.co/500x650/3a5f1e/ffffff?text=Cyberpunk%202077&font=montserrat', 49.99, 'RPG', 'Sobrevive y triunfa en Night City, una metrópolis obsesionada con el poder.'),
    ('Elden Ring', 'https://placehold.co/500x650/5f3a1e/ffffff?text=Elden%20Ring&font=montserrat', 59.99, 'RPG', 'Un vasto mundo de fantasía creado junto al autor de Canción de Hielo y Fuego.'),
    ('Mario Kart 8 Deluxe', 'https://placehold.co/500x650/1e5f3a/ffffff?text=Mario%20Kart%208%20Deluxe&font=montserrat', 59.99, 'Carreras', 'Carreras frenéticas con power-ups y personajes de Nintendo.'),
    ('Overwatch 2', 'https://placehold.co/500x650/3a1e5f/ffffff?text=Overwatch%202&font=montserrat', 0, 'Shooter', 'Shooter en equipo con héroes de habilidades únicas.'),
    ('League of Legends', 'https://placehold.co/500x650/2c2c54/ffffff?text=League%20of%20Legends&font=montserrat', 0, 'MOBA', 'Dos equipos compiten por destruir el núcleo enemigo en la Grieta del Invocador.'),
    ('Valorant', 'https://placehold.co/500x650/474787/ffffff?text=Valorant&font=montserrat', 0, 'Shooter', 'Shooter táctico 5v5 con agentes de habilidades especiales.'),
    ('Minecraft Dungeons', 'https://placehold.co/500x650/aaa69d/ffffff?text=Minecraft%20Dungeons&font=montserrat', 19.99, 'Acción', 'Un dungeon crawler cooperativo ambientado en el universo de Minecraft.'),
    ('Terraria', 'https://placehold.co/500x650/227093/ffffff?text=Terraria&font=montserrat', 9.99, 'Sandbox', 'Cava, construye y lucha en un mundo 2D generado aleatoriamente.'),
    ('Rocket League', 'https://placehold.co/500x650/218c74/ffffff?text=Rocket%20League&font=montserrat', 19.99, 'Deportes', 'Fútbol con autos cohete a alta velocidad.'),
    ('Hollow Knight', 'https://placehold.co/500x650/b33939/ffffff?text=Hollow%20Knight&font=montserrat', 14.99, 'Metroidvania', 'Explora un reino subterráneo en ruinas habitado por insectos.'),
    ('Celeste', 'https://placehold.co/500x650/1e3a5f/ffffff?text=Celeste&font=montserrat', 19.99, 'Plataformas', 'Ayuda a Madeline a escalar una montaña llena de peligros y de sí misma.'),
    ('It Takes Two', 'https://placehold.co/500x650/5f1e3a/ffffff?text=It%20Takes%20Two&font=montserrat', 39.99, 'Aventura', 'Una pareja convertida en muñecos debe cooperar para volver a ser humanos.')
) AS juegos(nombre, imagen, precio, genero, descripcion)
WHERE NOT EXISTS (
  SELECT 1 FROM videojuegos
);
