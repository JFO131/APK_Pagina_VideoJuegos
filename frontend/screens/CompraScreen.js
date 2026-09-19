// screens/CompraScreen.js
import { useState, useCallback } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { obtenerCarritoLocal, vaciarCarritoLocal } from '../database/sqlite';
import { hayConexion } from '../services/conexion';
import { obtenerSesion } from '../services/sesion';
import { registrarCompra } from '../services/api';
import { useTema } from '../context/TemaContext';

export default function CompraScreen({ navigation }) {
  const { colores } = useTema();
  const [items, setItems] = useState([]);
  const [confirmando, setConfirmando] = useState(false);

  useFocusEffect(useCallback(() => { setItems(obtenerCarritoLocal()); }, []));

  const total = items.reduce((suma, item) => suma + item.precio * item.cantidad, 0);

  async function manejarConfirmarCompra() {
    const conectado = await hayConexion();
    if (!conectado) {
      Alert.alert('Sin conexión', 'Necesitas conexión a Internet para completar la compra. Tu carrito se mantiene guardado.');
      return;
    }
    const sesion = await obtenerSesion();
    if (!sesion) {
      Alert.alert('Sesión requerida', 'Debes iniciar sesión para comprar');
      navigation.navigate('Login');
      return;
    }
    try {
      setConfirmando(true);
      const itemsParaEnviar = items.map((item) => ({ videojuego_id: item.videojuego_id, cantidad: item.cantidad, precio_unitario: item.precio }));
      const resultado = await registrarCompra(sesion.token, itemsParaEnviar);
      vaciarCarritoLocal();
      setItems([]);
      Alert.alert('¡Compra realizada!', `Tu compra #${resultado.compraId} por $${resultado.total.toFixed(2)} fue registrada correctamente.`, [{ text: 'OK', onPress: () => navigation.navigate('Catalogo') }]);
    } catch (error) {
      Alert.alert('Error', error.message);
    } finally {
      setConfirmando(false);
    }
  }

  if (items.length === 0) {
    return (
      <View style={[estilos.centrado, { backgroundColor: colores.fondo }]}>
        <Text style={{ color: colores.textoSecundario, fontSize: 16 }}>No hay productos para comprar</Text>
      </View>
    );
  }

  return (
    <View style={[estilos.contenedor, { backgroundColor: colores.fondo }]}>
      <Text style={[estilos.titulo, { color: colores.texto }]}>Resumen de tu compra</Text>
      <FlatList
        data={items}
        keyExtractor={(item) => item.local_id}
        contentContainerStyle={{ paddingHorizontal: 16 }}
        renderItem={({ item }) => (
          <View style={[estilos.fila, { backgroundColor: colores.tarjeta }]}>
            <Text style={{ color: colores.texto, fontSize: 14, flex: 1 }}>{item.nombre} x{item.cantidad}</Text>
            <Text style={{ color: colores.primario, fontSize: 14, fontWeight: 'bold' }}>${(item.precio * item.cantidad).toFixed(2)}</Text>
          </View>
        )}
      />
      <View style={[estilos.resumen, { backgroundColor: colores.tarjeta, borderTopColor: colores.borde }]}>
        <Text style={[estilos.total, { color: colores.texto }]}>Total a pagar: ${total.toFixed(2)}</Text>
        <TouchableOpacity style={[estilos.boton, { backgroundColor: colores.primario }]} onPress={manejarConfirmarCompra} disabled={confirmando}>
          <Text style={{ color: colores.fondo, fontWeight: 'bold', fontSize: 16 }}>{confirmando ? 'Procesando...' : 'Confirmar compra'}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const estilos = StyleSheet.create({
  contenedor: { flex: 1 },
  centrado: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  titulo: { fontSize: 20, fontWeight: 'bold', padding: 16 },
  fila: { flexDirection: 'row', justifyContent: 'space-between', padding: 14, borderRadius: 10, marginBottom: 10 },
  resumen: { padding: 16, borderTopWidth: 1 },
  total: { fontSize: 18, fontWeight: 'bold', marginBottom: 12, textAlign: 'right' },
  boton: { padding: 16, borderRadius: 10, alignItems: 'center' },
});