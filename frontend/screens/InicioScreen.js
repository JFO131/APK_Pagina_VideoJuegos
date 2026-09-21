// screens/InicioScreen.js
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useTema } from '../context/TemaContext';
import { tipografia } from '../constants/tipografia';

export default function InicioScreen({ navigation }) {
  const { colores } = useTema();

  return (
    <LinearGradient colors={colores.fondoDegradado} style={estilos.contenedor}>
      <View style={[estilos.circuloIcono, { backgroundColor: `${colores.primario}22` }]}>
        <Ionicons name="game-controller-outline" size={44} color={colores.primario} />
      </View>

      <Text style={[estilos.titulo, { color: colores.texto }]}>Tienda de Videojuegos</Text>
      <Text style={[estilos.subtitulo, { color: colores.textoSecundario }]}>Los mejores juegos, en un solo lugar</Text>

      <TouchableOpacity style={[estilos.botonPrimario, { backgroundColor: colores.primario }]} onPress={() => navigation.navigate('Login')}>
        <Text style={{ color: colores.fondo, fontFamily: tipografia.semibold, fontSize: 16 }}>Iniciar sesión</Text>
      </TouchableOpacity>

      <TouchableOpacity style={[estilos.botonSecundario, { borderColor: colores.primario }]} onPress={() => navigation.navigate('Registro')}>
        <Text style={{ color: colores.primario, fontFamily: tipografia.semibold, fontSize: 16 }}>Crear cuenta</Text>
      </TouchableOpacity>
    </LinearGradient>
  );
}

const estilos = StyleSheet.create({
  contenedor: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24 },
  circuloIcono: { width: 96, height: 96, borderRadius: 24, justifyContent: 'center', alignItems: 'center', marginBottom: 24 },
  titulo: { fontSize: 26, fontFamily: tipografia.bold, marginBottom: 8, textAlign: 'center' },
  subtitulo: { fontSize: 14, fontFamily: tipografia.regular, marginBottom: 40 },
  botonPrimario: { paddingVertical: 14, paddingHorizontal: 40, borderRadius: 10, width: '100%', alignItems: 'center', marginBottom: 14 },
  botonSecundario: { borderWidth: 1.5, paddingVertical: 14, paddingHorizontal: 40, borderRadius: 10, width: '100%', alignItems: 'center' },
});