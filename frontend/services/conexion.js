// services/conexion.js
// Ayuda a saber si el celular tiene conexión a internet,
// y permite "escuchar" cuando la conexión cambia.

import NetInfo from '@react-native-community/netinfo';

// Devuelve true/false según si hay conexión en este momento
export async function hayConexion() {
  const estado = await NetInfo.fetch();
  return estado.isConnected && estado.isInternetReachable !== false;
}

// Ejecuta una función cada vez que la conexión cambia (de online a offline o viceversa).
// Devuelve una función para dejar de escuchar (se usa al desmontar un componente).
export function escucharCambiosDeConexion(alCambiar) {
  return NetInfo.addEventListener((estado) => {
    const conectado = estado.isConnected && estado.isInternetReachable !== false;
    alCambiar(conectado);
  });
}