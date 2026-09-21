// constants/temas.js
// Dos paletas de colores. Las pantallas piden la actual con el hook
// useTema() en vez de importar un solo objeto fijo.

export const temaOscuro = {
  nombre: 'oscuro',
  fondo: '#12121e',
  fondoDegradado: ['#0f0f1a', '#1a1a2e', '#16213e'],
  tarjeta: '#1e1e2e',
  tarjetaClara: '#2a2a3e',
  borde: '#2a2a3e',
  texto: '#ffffff',
  textoSecundario: '#a0a0c0',
  textoTenue: '#666666',
  primario: '#7f19df',
  primarioDegradado: ['#af4ade', '#7f19df'],
  peligro: '#f87171',
  info: '#60a5fa',
};

export const temaClaro = {
  nombre: 'claro',
  fondo: '#f4f4f8',
  fondoDegradado: ['#ffffff', '#f0f0f5', '#e8e8f0'],
  tarjeta: '#ffffff',
  tarjetaClara: '#eaeaf2',
  borde: '#dcdce4',
  texto: '#1a1a2e',
  textoSecundario: '#5a5a70',
  textoTenue: '#9a9aa8',
  primario: '#7f19df',
  primarioDegradado: ['#af4ade', '#7f19df'],
  peligro: '#dc2626',
  info: '#2563eb',
};