// server.js
require('./database/init');

const express = require('express');
const cors = require('cors');
const juegosRoutes = require('./routes/juegos.routes');
const authRoutes = require('./routes/auth.routes'); // NUEVO

const app = express();
const PUERTO = 3000;

app.use(cors());
app.use(express.json());

app.use('/api/juegos', juegosRoutes);
app.use('/api/auth', authRoutes); // NUEVO

app.get('/', (req, res) => {
  res.json({ mensaje: 'API de la tienda de videojuegos funcionando' });
});

app.listen(PUERTO, '0.0.0.0', () => {
  console.log(`Servidor corriendo en http://localhost:${PUERTO}`);
});