// services/api.js
// Aquí definimos la URL base del backend y las funciones
// que hacen las peticiones HTTP a la API.

// IMPORTANTE: si pruebas en un celular físico o emulador,
// "localhost" no funciona porque apunta al propio celular.
// Debes usar la IP de tu computadora en la red local, ej: "192.168.1.100"
const URL_BASE = 'http://192.168.1.7:3000/api/juegos';

// Trae la lista completa de videojuegos
export async function obtenerJuegos() {
  const respuesta = await fetch(URL_BASE);

  if (!respuesta.ok) {
    throw new Error('No se pudo obtener el catálogo de juegos');
  }

  return await respuesta.json();
}

// Trae el detalle de un solo videojuego por su id
export async function obtenerJuegoPorId(id) {
  const respuesta = await fetch(`${URL_BASE}/${id}`);

  if (!respuesta.ok) {
    throw new Error('No se pudo obtener el videojuego');
  }

  return await respuesta.json();
}
