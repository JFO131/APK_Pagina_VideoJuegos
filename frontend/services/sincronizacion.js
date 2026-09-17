// Envía al backend los cambios del carrito que se hicieron mientras
// el celular estaba sin conexión (o que aún no se habían sincronizado).

import { sincronizarCarrito } from './api';
import { obtenerSesion } from './sesion';
import {
  obtenerCarritoNoSincronizado,
  marcarCarritoComoSincronizado,
  eliminarFilasMarcadasComoEliminadas,
} from '../database/sqlite';

export async function sincronizarCarritoConServidor() {
  // Si el usuario no ha iniciado sesión, no hay con quién sincronizar
  const sesion = await obtenerSesion();
  if (!sesion) return;

  const pendientes = obtenerCarritoNoSincronizado();
  if (pendientes.length === 0) return; // nada que hacer

  const items = pendientes.map((item) => ({
    local_id: item.local_id,
    videojuego_id: item.videojuego_id,
    cantidad: item.cantidad,
    eliminado: item.eliminado === 1,
  }));

  await sincronizarCarrito(sesion.token, items);

  // El backend ya confirmó, así que marcamos todo como sincronizado
  marcarCarritoComoSincronizado(items.map((i) => i.local_id));

  // Limpiamos localmente lo que ya se eliminó también en el servidor
  eliminarFilasMarcadasComoEliminadas();
}