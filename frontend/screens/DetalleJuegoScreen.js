// screens/DetalleJuegoScreen.js
import { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { obtenerJuegoPorId } from '../services/api';
import { obtenerCatalogoLocal, agregarAlCarritoLocal } from '../database/sqlite';
import { hayConexion } from '../services/conexion';
import { obtenerIcono } from '../constants/generos';
import { useTema } from '../context/TemaContext';

export default function DetalleJuegoScreen({ route, navigation }) {
  const { juegoId } = route.params;
  const { colores } = useTema();
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
        setJuego(await obtenerJuegoPorId(juegoId));
      } else {
        const local = obtenerCatalogoLocal();
        setJuego(local.find((j) => j.id === juegoId) || null);
      }
    } catch (error) {
      const local = obtenerCatalogoLocal();
      setJuego(local.find((j) => j.id === juegoId) || null);
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

  if (cargando) return <View style={[estilos.centrado, { backgroundColor: colores.fondo }]} />;

  if (!juego) {
    return (
      <View style={[estilos.centrado, { backgroundColor: colores.fondo }]}>
        <Text style={{ color: colores.peligro, fontSize: 16 }}>No se pudo cargar este videojuego.</Text>
      </View>
    );
  }

  return (
    <ScrollView style={{ flex: 1, backgroundColor: colores.fondo }}>
      <View style={[estilos.banner, { backgroundColor: `#${juego.imagen}` }]}>
        <Ionicons name={obtenerIcono(juego.genero)} size={80} color="rgba(255,255,255,0.3)" />
      </View>

      <View style={estilos.info}>
        <Text style={[estilos.nombre, { color: colores.texto }]}>{juego.nombre}</Text>
        <Text style={[estilos.genero, { color: colores.textoSecundario }]}>{juego.genero}</Text>
        <Text style={[estilos.precio, { color: colores.primario }]}>
          {juego.precio === 0 ? 'Gratis' : `$${juego.precio.toFixed(2)}`}
        </Text>

        <Text style={[estilos.tituloDescripcion, { color: colores.texto }]}>Descripción</Text>
        <Text style={[estilos.descripcion, { color: colores.textoSecundario }]}>{juego.descripcion}</Text>

        <TouchableOpacity style={[estilos.boton, { backgroundColor: colores.primario }]} onPress={manejarAgregarAlCarrito}>
          <Text style={{ color: colores.fondo, fontWeight: 'bold', fontSize: 16 }}>Agregar al carrito</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const estilos = StyleSheet.create({
  centrado: { flex: 1 },
  banner: { width: '100%', height: 220, justifyContent: 'center', alignItems: 'center' },
  info: { padding: 20 },
  nombre: { fontSize: 24, fontWeight: 'bold' },
  genero: { fontSize: 14, marginTop: 4 },
  precio: { fontSize: 22, fontWeight: 'bold', marginTop: 12 },
  tituloDescripcion: { fontSize: 16, fontWeight: 'bold', marginTop: 20, marginBottom: 6 },
  descripcion: { fontSize: 14, lineHeight: 20 },
  boton: { padding: 16, borderRadius: 10, alignItems: 'center', marginTop: 28 },
});