// components/ItemCarrito.js
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { obtenerIcono } from '../constants/generos';
import { obtenerImagenLocal } from '../constants/imagenesJuegos';
import { useTema } from '../context/TemaContext';

export default function ItemCarrito({ item, alCambiarCantidad, alEliminar }) {
  const { colores } = useTema();
  const subtotal = item.precio * item.cantidad;
  const imagenLocal = obtenerImagenLocal(item.nombre);
  const tieneImagenRemota = !imagenLocal && item.imagen && item.imagen.startsWith('http');

  return (
    <View style={[estilos.fila, { backgroundColor: colores.tarjeta }]}>
      <View style={[estilos.miniatura, { backgroundColor: colores.tarjetaClara }]}>
        {imagenLocal ? (
          <Image source={imagenLocal} style={estilos.imagenMiniatura} resizeMode="cover" />
        ) : tieneImagenRemota ? (
          <Image source={{ uri: item.imagen }} style={estilos.imagenMiniatura} resizeMode="cover" />
        ) : (
          <Ionicons name={obtenerIcono(item.genero)} size={22} color="rgba(255,255,255,0.5)" />
        )}
      </View>

      <View style={estilos.info}>
        <Text style={[estilos.nombre, { color: colores.texto }]} numberOfLines={1}>{item.nombre}</Text>
        <Text style={[estilos.precioUnitario, { color: colores.textoSecundario }]}>${item.precio.toFixed(2)} c/u</Text>

        <View style={estilos.controles}>
          <TouchableOpacity style={[estilos.botonCantidad, { backgroundColor: colores.tarjetaClara }]} onPress={() => alCambiarCantidad(item.local_id, item.cantidad - 1)}>
            <Text style={{ color: colores.texto, fontSize: 16, fontWeight: 'bold' }}>−</Text>
          </TouchableOpacity>
          <Text style={{ color: colores.texto, marginHorizontal: 12 }}>{item.cantidad}</Text>
          <TouchableOpacity style={[estilos.botonCantidad, { backgroundColor: colores.tarjetaClara }]} onPress={() => alCambiarCantidad(item.local_id, item.cantidad + 1)}>
            <Text style={{ color: colores.texto, fontSize: 16, fontWeight: 'bold' }}>+</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={estilos.derecha}>
        <Text style={[estilos.subtotal, { color: colores.primario }]}>${subtotal.toFixed(2)}</Text>
        <TouchableOpacity onPress={() => alEliminar(item.local_id)}>
          <Text style={{ color: colores.peligro, fontSize: 12, marginTop: 8 }}>Eliminar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const estilos = StyleSheet.create({
  fila: { flexDirection: 'row', borderRadius: 12, padding: 10, marginBottom: 12, alignItems: 'center' },
  miniatura: { width: 60, height: 60, borderRadius: 8, justifyContent: 'center', alignItems: 'center', overflow: 'hidden' },
  imagenMiniatura: { width: '100%', height: '100%' },
  info: { flex: 1, marginLeft: 10 },
  nombre: { fontSize: 14, fontWeight: 'bold' },
  precioUnitario: { fontSize: 12, marginTop: 2 },
  controles: { flexDirection: 'row', alignItems: 'center', marginTop: 8 },
  botonCantidad: { width: 28, height: 28, borderRadius: 6, justifyContent: 'center', alignItems: 'center' },
  derecha: { alignItems: 'flex-end' },
  subtotal: { fontSize: 15, fontWeight: 'bold' },
});