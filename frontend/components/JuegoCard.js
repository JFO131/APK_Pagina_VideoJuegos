// components/JuegoCard.js
// Tarjeta estilo "póster". La portada es un color de fondo + un ícono
// del género (no una imagen descargada), así siempre se ve bien.

import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { obtenerIcono } from '../constants/generos';

export default function JuegoCard({ juego, alPresionar }) {
  return (
    <TouchableOpacity
      style={[estilos.tarjeta, { backgroundColor: `#${juego.imagen}` }]}
      onPress={alPresionar}
      activeOpacity={0.85}
    >
      <View style={estilos.iconoFondo}>
        <Ionicons name={obtenerIcono(juego.genero)} size={54} color="rgba(255,255,255,0.18)" />
      </View>

      <View style={estilos.insignia}>
        <Text style={estilos.textoInsignia}>{juego.genero}</Text>
      </View>

      <View style={estilos.overlay}>
        <Text style={estilos.nombre} numberOfLines={2}>{juego.nombre}</Text>
        <Text style={estilos.precio}>
          {juego.precio === 0 ? 'Gratis' : `$${juego.precio.toFixed(2)}`}
        </Text>
      </View>
    </TouchableOpacity>
  );
}

const estilos = StyleSheet.create({
  tarjeta: { width: '48%', aspectRatio: 0.72, borderRadius: 16, overflow: 'hidden', marginBottom: 16, justifyContent: 'flex-end' },
  iconoFondo: { ...StyleSheet.absoluteFillObject, justifyContent: 'center', alignItems: 'center' },
  insignia: { position: 'absolute', top: 10, left: 10, backgroundColor: 'rgba(0,0,0,0.4)', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8 },
  textoInsignia: { color: '#fff', fontSize: 10, fontWeight: 'bold' },
  overlay: { backgroundColor: 'rgba(0,0,0,0.55)', padding: 10 },
  nombre: { color: '#fff', fontSize: 14, fontWeight: 'bold' },
  precio: { color: '#4ade80', fontSize: 15, fontWeight: 'bold', marginTop: 4 },
});