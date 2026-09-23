// screens/CarritoScreen.js
import { useState, useCallback } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { obtenerCarritoLocal, actualizarCantidadLocal, eliminarDelCarritoLocal } from '../database/sqlite';
import ItemCarrito from '../components/ItemCarrito';
import { useTema } from '../context/TemaContext';

export default function CarritoScreen({ navigation }) {
  const { colores } = useTema();
  const [items, setItems] = useState([]);

  useFocusEffect(useCallback(() => { cargarCarrito(); }, []));

  function cargarCarrito() {
    setItems(obtenerCarritoLocal());
  }

  function manejarCambioCantidad(localId, nuevaCantidad) {
    actualizarCantidadLocal(localId, nuevaCantidad);
    cargarCarrito();
  }

  function manejarEliminar(localId) {
    eliminarDelCarritoLocal(localId);
    cargarCarrito();
  }

  const total = items.reduce((suma, item) => suma + Number(item?.precio ?? 0) * Number(item?.cantidad ?? 0), 0);

  if (items.length === 0) {
    return (
      <View style={[estilos.centrado, { backgroundColor: colores.fondo }]}>
        <Text style={{ color: colores.textoSecundario, fontSize: 16 }}>Tu carrito está vacío</Text>
      </View>
    );
  }

  return (
    <View style={[estilos.contenedor, { backgroundColor: colores.fondo }]}>
      <FlatList
        data={items}
        keyExtractor={(item) => item.local_id}
        contentContainerStyle={{ padding: 12 }}
        renderItem={({ item }) => <ItemCarrito item={item} alCambiarCantidad={manejarCambioCantidad} alEliminar={manejarEliminar} />}
      />
      <View style={[estilos.resumen, { backgroundColor: colores.tarjeta, borderTopColor: colores.borde }]}>
        <Text style={[estilos.total, { color: colores.texto }]}>Total: ${total.toFixed(2)}</Text>
        <TouchableOpacity style={[estilos.boton, { backgroundColor: colores.primario }]} onPress={() => navigation.navigate('Compra')}>
          <Text style={{ color: colores.fondo, fontWeight: 'bold', fontSize: 16 }}>Continuar con la compra</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const estilos = StyleSheet.create({
  contenedor: { flex: 1 },
  centrado: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  resumen: { padding: 16, borderTopWidth: 1 },
  total: { fontSize: 18, fontWeight: 'bold', marginBottom: 12, textAlign: 'right' },
  boton: { padding: 16, borderRadius: 10, alignItems: 'center' },
});