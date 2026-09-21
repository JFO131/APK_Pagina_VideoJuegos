// Guarda y recupera la sesión del usuario usando almacenamiento local del celular.

import AsyncStorage from '@react-native-async-storage/async-storage';

const CLAVE_TOKEN = 'sesion_token';
const CLAVE_USUARIO = 'sesion_usuario';

// Guarda el token y los datos del usuario después de iniciar sesión
export async function guardarSesion(token, usuario) {
  await AsyncStorage.setItem(CLAVE_TOKEN, token);
  await AsyncStorage.setItem(CLAVE_USUARIO, JSON.stringify(usuario));
}

// Recupera la sesión guardada (o null si no hay ninguna)
export async function obtenerSesion() {
  const token = await AsyncStorage.getItem(CLAVE_TOKEN);
  const usuarioTexto = await AsyncStorage.getItem(CLAVE_USUARIO);

  if (!token || !usuarioTexto) {
    return null;
  }

  return { token, usuario: JSON.parse(usuarioTexto) };
}

// Borra la sesión (cerrar sesión)
export async function cerrarSesion() {
  await AsyncStorage.removeItem(CLAVE_TOKEN);
  await AsyncStorage.removeItem(CLAVE_USUARIO);
}

// Actualiza los datos del usuario en la sesión guardada
export async function actualizarUsuarioSesion(usuario) {
  await AsyncStorage.setItem(CLAVE_USUARIO, JSON.stringify(usuario));
}