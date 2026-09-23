// Envía al backend los cambios del carrito que se hicieron mientras
// el celular estaba sin conexión (o que aún no se habían sincronizado).

import { sincronizarCarrito, registrarCompra } from './api';
import { obtenerSesion } from './sesion';
import {
  obtenerCarritoNoSincronizado,
  marcarCarritoComoSincronizado,
  eliminarFilasMarcadasComoEliminadas,
  obtenerComprasPendientes,
  marcarCompraPendienteComoSincronizada,
} from '../database/sqlite';

export async function sincronizarCarritoConServidor() {
  const sesion = await obtenerSesion();
  if (!sesion) return;

  const pendientes = obtenerCarritoNoSincronizado();
  if (pendientes.length === 0) return;

  const items = pendientes.map((item) => ({
    local_id: item.local_id,
    videojuego_id: item.videojuego_id,
    cantidad: item.cantidad,
    eliminado: item.eliminado === 1,
  }));

  await sincronizarCarrito(sesion.token, items);
  marcarCarritoComoSincronizado(items.map((i) => i.local_id));
  eliminarFilasMarcadasComoEliminadas();
}

export async function sincronizarComprasPendientes() {
  const sesion = await obtenerSesion();
  if (!sesion) return 0;

  const pendientes = obtenerComprasPendientes();
  if (pendientes.length === 0) return 0;

  let sincronizadas = 0;

  for (const compra of pendientes) {
    try {
      const payload = JSON.parse(compra.payload);
      const items = (payload.items || []).map((item) => ({
        videojuego_id: item.videojuego_id,
        cantidad: item.cantidad,
        precio_unitario: item.precio_unitario,
      }));

      await registrarCompra(sesion.token, items);
      marcarCompraPendienteComoSincronizada(compra.local_id);
      sincronizadas += 1;
    } catch (error) {
      // Si falla, se deja pendiente para volver a intentar cuando haya conexión.
      break;
    }
  }

  return sincronizadas;
}