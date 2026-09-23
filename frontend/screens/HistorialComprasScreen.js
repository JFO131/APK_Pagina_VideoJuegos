// screens/HistorialComprasScreen.js
import { useState, useCallback } from 'react';
import { View, Text, FlatList, ActivityIndicator, StyleSheet } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { obtenerSesion } from '../services/sesion';
import { obtenerHistorialCompras } from '../services/api';
import { hayConexion } from '../services/conexion';
import { useTema } from '../context/TemaContext';

export default function HistorialComprasScreen() {
  const { colores } = useTema();
  const [compras, setCompras] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);

  useFocusEffect(useCallback(() => { cargarHistorial(); }, []));

  async function cargarHistorial() {
    try {
      setCargando(true);
      const conectado = await hayConexion();
      if (!conectado) {
        setError('Necesitas conexión a Internet para ver tu historial de compras.');
        return;
      }
      const sesion = await obtenerSesion();
      if (!sesion) {
        setError('Debes iniciar sesión para ver tu historial.');
        return;
      }
      const datos = await obtenerHistorialCompras(sesion.token);
      setCompras(datos);
      setError(null);
    } catch (err) {
      setError('No se pudo cargar el historial de compras.');
    } finally {
      setCargando(false);
    }
  }

  if (cargando) {
    return (
      <View style={[estilos.centrado, { backgroundColor: colores.fondo }]}>
        <ActivityIndicator size="large" color={colores.primario} />
      </View>
    );
  }

  if (error) {
    return (
      <View style={[estilos.centrado, { backgroundColor: colores.fondo }]}>
        <Text style={{ color: colores.peligro, fontSize: 15, textAlign: 'center' }}>{error}</Text>
      </View>
    );
  }

  if (compras.length === 0) {
    return (
      <View style={[estilos.centrado, { backgroundColor: colores.fondo }]}>
        <Text style={{ color: colores.textoSecundario, fontSize: 15 }}>Todavía no tienes compras registradas</Text>
      </View>
    );
  }

  return (
    <FlatList
      style={{ backgroundColor: colores.fondo }}
      contentContainerStyle={{ padding: 16 }}
      data={compras}
      keyExtractor={(compra) => compra.id.toString()}
      renderItem={({ item: compra }) => (
        <View style={[estilos.tarjeta, { backgroundColor: colores.tarjeta }]}>
          <View style={estilos.encabezado}>
            <Text style={[estilos.numeroCompra, { color: colores.texto }]}>Compra #{compra.id}</Text>
            <Text style={{ color: colores.textoSecundario, fontSize: 12 }}>{new Date(compra.fecha).toLocaleDateString()}</Text>
          </View>
          {compra.productos.map((producto) => {
            const precioProducto = Number(producto?.precio_unitario ?? 0);
            const cantidad = Number(producto?.cantidad ?? 0);

            return (
              <View key={producto.id} style={estilos.filaProducto}>
                <Text style={{ color: colores.textoSecundario, fontSize: 13, flex: 1 }} numberOfLines={1}>{producto.nombre} x{cantidad}</Text>
                <Text style={{ color: colores.textoSecundario, fontSize: 13 }}>${(precioProducto * cantidad).toFixed(2)}</Text>
              </View>
            );
          })}
          <Text style={[estilos.total, { color: colores.primario }]}>Total: ${Number(compra?.total ?? 0).toFixed(2)}</Text>
        </View>
      )}
    />
  );
}

const estilos = StyleSheet.create({
  centrado: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24 },
  tarjeta: { borderRadius: 12, padding: 14, marginBottom: 14 },
  encabezado: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  numeroCompra: { fontWeight: 'bold', fontSize: 14 },
  filaProducto: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 },
  total: { fontWeight: 'bold', fontSize: 15, marginTop: 8, textAlign: 'right' },
});