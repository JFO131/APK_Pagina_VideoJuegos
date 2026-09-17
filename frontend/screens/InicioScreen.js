// screens/InicioScreen.js
// Pantalla de bienvenida con botones para ir a Login o Registro.

import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

export default function InicioScreen({ navigation }) {
  return (
    <View style={estilos.contenedor}>
      <Text style={estilos.titulo}>🎮 Tienda de Videojuegos</Text>
      <Text style={estilos.subtitulo}>Los mejores juegos, en un solo lugar</Text>

      <TouchableOpacity
        style={estilos.botonPrimario}
        onPress={() => navigation.navigate('Login')}
      >
        <Text style={estilos.textoBotonPrimario}>Iniciar sesión</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={estilos.botonSecundario}
        onPress={() => navigation.navigate('Registro')}
      >
        <Text style={estilos.textoBotonSecundario}>Crear cuenta</Text>
      </TouchableOpacity>
    </View>
  );
}

const estilos = StyleSheet.create({
  contenedor: {
    flex: 1,
    backgroundColor: '#12121e',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  titulo: {
    color: '#fff',
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitulo: {
    color: '#a0a0c0',
    fontSize: 15,
    marginBottom: 40,
  },
  botonPrimario: {
    backgroundColor: '#4ade80',
    paddingVertical: 14,
    paddingHorizontal: 40,
    borderRadius: 10,
    width: '100%',
    alignItems: 'center',
    marginBottom: 14,
  },
  textoBotonPrimario: {
    color: '#12121e',
    fontWeight: 'bold',
    fontSize: 16,
  },
  botonSecundario: {
    borderColor: '#4ade80',
    borderWidth: 1.5,
    paddingVertical: 14,
    paddingHorizontal: 40,
    borderRadius: 10,
    width: '100%',
    alignItems: 'center',
  },
  textoBotonSecundario: {
    color: '#4ade80',
    fontWeight: 'bold',
    fontSize: 16,
  },
});