require('dotenv').config();

const inicializarBase = require('./database/init');
const express = require('express');
const cors = require('cors');
const juegosRoutes = require('./routes/juegos.routes');
const authRoutes = require('./routes/auth.routes');
const carritoRoutes = require('./routes/carrito.routes');
const comprasRoutes = require('./routes/compras.routes');

const app = express();
const PUERTO = process.env.PORT || 3000;

async function iniciarServidor() {
  await inicializarBase();

  app.use(cors());
  app.use(express.json());

  app.use('/api/juegos', juegosRoutes);
  app.use('/api/auth', authRoutes);
  app.use('/api/carrito', carritoRoutes);
  app.use('/api/compras', comprasRoutes);

  app.get('/', (req, res) => {
    res.json({ mensaje: 'API de la tienda de videojuegos funcionando' });
  });

  app.listen(PUERTO, '0.0.0.0', () => {
    console.log(`Servidor corriendo en http://localhost:${PUERTO}`);
    console.log(`Modo de base de datos: ${process.env.DATABASE_URL ? 'online' : 'local'}`);
  });
}

iniciarServidor().catch((error) => {
  console.error('No se pudo iniciar la API:', error);
  process.exit(1);
});