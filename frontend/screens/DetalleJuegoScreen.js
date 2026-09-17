// screens/DetalleJuegoScreen.js
// Muestra la información completa de un videojuego y permite agregarlo al carrito.

import { useState, useEffect } from 'react';
import { View, Text, Image, TouchableOpacity, ScrollView, StyleSheet, Alert } from 'react-native';
import { obtenerJuegoPorId } from '../services/api';
import { obtenerCatalogoLocal, agregarAlCarritoLocal } from '../database/sqlite';
import { hayConexion } from '../services/conexion';

export default function DetalleJuegoScreen({ route, navigation }) {
  const { juegoId } = route.params;
  const [juego, setJuego] = useState(null);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    cargarJuego();
  }, []);

  async function cargarJuego() {
    try {
      setCargando(true);
      const conectado = await hayConexion();

      if (conectado) {
        const datos = await obtenerJuegoPorId(juegoId);
        setJuego(datos);
      } else {
        // Sin internet, buscamos el juego en el catálogo guardado localmente
        const catalogoLocal = obtenerCatalogoLocal();
        const encontrado = catalogoLocal.find((j) => j.id === juegoId);
        setJuego(encontrado || null);
      }
    } catch (error) {
      // Si falla la petición al backend, intentamos con lo local
      const catalogoLocal = obtenerCatalogoLocal();
      const encontrado = catalogoLocal.find((j) => j.id === juegoId);
      setJuego(encontrado || null);
    } finally {
      setCargando(false);
    }
  }

  function manejarAgregarAlCarrito() {
    agregarAlCarritoLocal(juego);
    Alert.alert('Agregado', `${juego.nombre} se agregó al carrito`, [
      { text: 'Seguir viendo juegos', style: 'cancel' },
      { text: 'Ir al carrito', onPress: () => navigation.navigate('Carrito') },
    ]);
  }

  if (cargando) {
    return <View style={estilos.centrado} />;
  }

  if (!juego) {
    return (
      <View style={estilos.centrado}>
        <Text style={estilos.textoError}>No se pudo cargar este videojuego.</Text>
      </View>
    );
  }

  return (
    <ScrollView style={estilos.contenedor}>
      <Image source={{ uri: juego.imagen }} style={estilos.imagen} />

      <View style={estilos.info}>
        <Text style={estilos.nombre}>{juego.nombre}</Text>
        <Text style={estilos.genero}>{juego.genero}</Text>
        <Text style={estilos.precio}>${juego.precio.toFixed(2)}</Text>

        <Text style={estilos.tituloDescripcion}>Descripción</Text>
        <Text style={estilos.descripcion}>{juego.descripcion}</Text>

        <TouchableOpacity style={estilos.boton} onPress={manejarAgregarAlCarrito}>
          <Text style={estilos.textoBoton}>Agregar al carrito</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
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
  },
  imagen: {
    width: '100%',
    height: 220,
  },
  info: {
    padding: 20,
  },
  nombre: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
  },
  genero: {
    color: '#a0a0c0',
    fontSize: 14,
    marginTop: 4,
  },
  precio: {
    color: '#4ade80',
    fontSize: 22,
    fontWeight: 'bold',
    marginTop: 12,
  },
  tituloDescripcion: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 6,
  },
  descripcion: {
    color: '#c0c0d0',
    fontSize: 14,
    lineHeight: 20,
  },
  boton: {
    backgroundColor: '#4ade80',
    padding: 16,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 28,
  },
  textoBoton: {
    color: '#12121e',
    fontWeight: 'bold',
    fontSize: 16,
  },
  textoError: {
    color: '#f87171',
    fontSize: 16,
    textAlign: 'center',
    marginTop: 40,
  },
});