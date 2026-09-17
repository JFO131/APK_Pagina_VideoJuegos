// Tarjeta que muestra la información básica de un videojuego.
// Recibe el juego como prop y una función que se ejecuta al presionarla.

import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';

export default function JuegoCard({ juego, alPresionar }) {
  return (
    <TouchableOpacity style={estilos.tarjeta} onPress={alPresionar}>
      <Image source={{ uri: juego.imagen }} style={estilos.imagen} />
      <View style={estilos.info}>
        <Text style={estilos.nombre}>{juego.nombre}</Text>
        <Text style={estilos.genero}>{juego.genero}</Text>
        <Text style={estilos.precio}>${juego.precio.toFixed(2)}</Text>
      </View>
    </TouchableOpacity>
  );
}

const estilos = StyleSheet.create({
  tarjeta: {
    flexDirection: 'row',
    backgroundColor: '#1e1e2e',
    borderRadius: 12,
    marginBottom: 12,
    overflow: 'hidden',
  },
  imagen: {
    width: 90,
    height: 90,
  },
  info: {
    flex: 1,
    padding: 10,
    justifyContent: 'center',
  },
  nombre: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  genero: {
    color: '#a0a0c0',
    fontSize: 13,
    marginTop: 2,
  },
  precio: {
    color: '#4ade80',
    fontSize: 15,
    fontWeight: 'bold',
    marginTop: 6,
  },
});
