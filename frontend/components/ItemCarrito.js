// components/ItemCarrito.js
// Muestra un producto dentro del carrito, con controles de cantidad y botón de eliminar.

import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';

export default function ItemCarrito({ item, alCambiarCantidad, alEliminar }) {
  const subtotal = item.precio * item.cantidad;

  return (
    <View style={estilos.fila}>
      <Image source={{ uri: item.imagen }} style={estilos.imagen} />

      <View style={estilos.info}>
        <Text style={estilos.nombre}>{item.nombre}</Text>
        <Text style={estilos.precio}>${item.precio.toFixed(2)} c/u</Text>

        <View style={estilos.controles}>
          <TouchableOpacity
            style={estilos.botonCantidad}
            onPress={() => alCambiarCantidad(item.local_id, item.cantidad - 1)}
          >
            <Text style={estilos.textoBotonCantidad}>−</Text>
          </TouchableOpacity>

          <Text style={estilos.cantidad}>{item.cantidad}</Text>

          <TouchableOpacity
            style={estilos.botonCantidad}
            onPress={() => alCambiarCantidad(item.local_id, item.cantidad + 1)}
          >
            <Text style={estilos.textoBotonCantidad}>+</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={estilos.derecha}>
        <Text style={estilos.subtotal}>${subtotal.toFixed(2)}</Text>
        <TouchableOpacity onPress={() => alEliminar(item.local_id)}>
          <Text style={estilos.eliminar}>Eliminar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const estilos = StyleSheet.create({
  fila: {
    flexDirection: 'row',
    backgroundColor: '#1e1e2e',
    borderRadius: 12,
    padding: 10,
    marginBottom: 12,
    alignItems: 'center',
  },
  imagen: {
    width: 60,
    height: 60,
    borderRadius: 8,
  },
  info: {
    flex: 1,
    marginLeft: 10,
  },
  nombre: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  precio: {
    color: '#a0a0c0',
    fontSize: 12,
    marginTop: 2,
  },
  controles: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  botonCantidad: {
    backgroundColor: '#2a2a3e',
    width: 28,
    height: 28,
    borderRadius: 6,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textoBotonCantidad: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  cantidad: {
    color: '#fff',
    fontSize: 14,
    marginHorizontal: 12,
  },
  derecha: {
    alignItems: 'flex-end',
  },
  subtotal: {
    color: '#4ade80',
    fontSize: 15,
    fontWeight: 'bold',
  },
  eliminar: {
    color: '#f87171',
    fontSize: 12,
    marginTop: 8,
  },
});