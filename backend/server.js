// server.js
require('./database/init'); // crea tablas y datos de prueba al iniciar

const express = require('express');
const cors = require('cors');
const juegosRoutes = require('./routes/juegos.routes');

const app = express();
const PUERTO = 3000;

app.use(cors());          // permite que la app móvil consuma la API
app.use(express.json());  // permite recibir JSON en el body de las peticiones

app.use('/api/juegos', juegosRoutes);

app.get('/', (req, res) => {
  res.json({ mensaje: 'API de la tienda de videojuegos funcionando' });
});

app.listen(PUERTO, '0.0.0.0', () => {
  console.log(`Servidor corriendo en http://localhost:${PUERTO}`);
});
