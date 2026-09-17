// Muestra el contenido del carrito, permite modificar cantidades,
// eliminar productos, y ver el total antes de ir a comprar.

import { useState, useCallback } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import {
  obtenerCarritoLocal,
  actualizarCantidadLocal,
  eliminarDelCarritoLocal,
} from '../database/sqlite';
import ItemCarrito from '../components/ItemCarrito';

export default function CarritoScreen({ navigation }) {
  const [items, setItems] = useState([]);

  // useFocusEffect vuelve a cargar el carrito cada vez que el usuario
  // entra a esta pantalla (por ejemplo, después de agregar algo nuevo).
  useFocusEffect(
    useCallback(() => {
      cargarCarrito();
    }, [])
  );

  function cargarCarrito() {
    const datos = obtenerCarritoLocal();
    setItems(datos);
  }

  function manejarCambioCantidad(localId, nuevaCantidad) {
    actualizarCantidadLocal(localId, nuevaCantidad);
    cargarCarrito();
  }

  function manejarEliminar(localId) {
    eliminarDelCarritoLocal(localId);
    cargarCarrito();
  }

  const total = items.reduce((suma, item) => suma + item.precio * item.cantidad, 0);

  if (items.length === 0) {
    return (
      <View style={estilos.centrado}>
        <Text style={estilos.textoVacio}>Tu carrito está vacío</Text>
      </View>
    );
  }

  return (
    <View style={estilos.contenedor}>
      <FlatList
        data={items}
        keyExtractor={(item) => item.local_id}
        contentContainerStyle={{ padding: 12 }}
        renderItem={({ item }) => (
          <ItemCarrito
            item={item}
            alCambiarCantidad={manejarCambioCantidad}
            alEliminar={manejarEliminar}
          />
        )}
      />

      <View style={estilos.resumen}>
        <Text style={estilos.total}>Total: ${total.toFixed(2)}</Text>
        <TouchableOpacity
          style={estilos.boton}
          onPress={() => navigation.navigate('Compra')}
        >
          <Text style={estilos.textoBoton}>Continuar con la compra</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const estilos = StyleSheet.create({
  contenedor: {
    flex: 1,
    backgroundColor: '#12121e',
  },
  centrado: {
    flex: 1,
    backgroundColor: '#12121e',
    justifyContent: 'center',
    alignItems: 'center',
  },
  textoVacio: {
    color: '#a0a0c0',
    fontSize: 16,
  },
  resumen: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#2a2a3e',
    backgroundColor: '#1e1e2e',
  },
  total: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
    textAlign: 'right',
  },
  boton: {
    backgroundColor: '#4ade80',
    padding: 16,
    borderRadius: 10,
    alignItems: 'center',
  },
  textoBoton: {
    color: '#12121e',
    fontWeight: 'bold',
    fontSize: 16,
  },
});