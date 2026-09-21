// components/JuegoCard.js
// Tarjeta con diseño tipo tienda oficial (Steam / Nintendo eShop):
// La imagen del juego se muestra en la parte superior sin texto que la obstruya,
// y la información (título, género y precio) se presenta de forma clara y alineada abajo.

import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { obtenerIcono } from '../constants/generos';
import { obtenerImagenLocal } from '../constants/imagenesJuegos';
import { tipografia } from '../constants/tipografia';
import { useTema } from '../context/TemaContext';

export default function JuegoCard({ juego, alPresionar }) {
  const { colores } = useTema();
  const imagenLocal = obtenerImagenLocal(juego.nombre);
  const tieneImagenRemota = !imagenLocal && juego.imagen && juego.imagen.startsWith('http');
  const imagen = imagenLocal || (tieneImagenRemota ? { uri: juego.imagen } : null);

  return (
    <TouchableOpacity
      style={[estilos.tarjeta, { backgroundColor: colores.tarjeta }]}
      onPress={alPresionar}
      activeOpacity={0.85}
    >
      <View style={estilos.contenedorImagen}>
        {imagen ? (
          <Image source={imagen} style={estilos.imagen} resizeMode="cover" />
        ) : (
          <View style={estilos.iconoFondo}>
            <Ionicons name={obtenerIcono(juego.genero)} size={48} color="rgba(255,255,255,0.25)" />
          </View>
        )}

        <View style={estilos.insignia}>
          <Text style={estilos.textoInsignia}>{juego.genero}</Text>
        </View>
      </View>

      <View style={estilos.info}>
        <Text style={[estilos.nombre, { color: colores.texto }]} numberOfLines={2}>
          {juego.nombre}
        </Text>
        <Text style={[estilos.precio, { color: colores.primario }]}>
          {juego.precio === 0 ? 'Gratis' : `$${juego.precio.toFixed(2)}`}
        </Text>
      </View>
    </TouchableOpacity>
  );
}

const estilos = StyleSheet.create({
  tarjeta: {
    width: '48%',
    borderRadius: 14,
    overflow: 'hidden',
    marginBottom: 16,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
  },
  contenedorImagen: {
    width: '100%',
    aspectRatio: 0.82,
    backgroundColor: '#0a0a14',
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
  },
  imagen: {
    width: '100%',
    height: '100%',
  },
  iconoFondo: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1b1b2f',
  },
  insignia: {
    position: 'absolute',
    top: 8,
    left: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.65)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  textoInsignia: {
    color: '#fff',
    fontSize: 10,
    fontFamily: tipografia.medium,
  },
  info: {
    padding: 10,
    justifyContent: 'space-between',
  },
  nombre: {
    fontSize: 13,
    fontFamily: tipografia.semibold,
    lineHeight: 18,
    minHeight: 36,
  },
  precio: {
    fontSize: 15,
    fontFamily: tipografia.bold,
    marginTop: 6,
  },
});