// screens/LoginScreen.js
// Formulario de inicio de sesión.

import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { iniciarSesion } from '../services/api';
import { guardarSesion } from '../services/sesion';

export default function LoginScreen({ navigation }) {
  const [correo, setCorreo] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [cargando, setCargando] = useState(false);

  async function manejarLogin() {
    if (!correo || !contrasena) {
      Alert.alert('Campos incompletos', 'Escribe tu correo y contraseña');
      return;
    }

    try {
      setCargando(true);
      const datos = await iniciarSesion(correo, contrasena);
      await guardarSesion(datos.token, datos.usuario);

      // Reemplaza toda la pila de navegación para que no pueda
      // "regresar" al login con el botón de atrás
      navigation.reset({
        index: 0,
        routes: [{ name: 'Catalogo' }],
      });
    } catch (error) {
      Alert.alert('Error', error.message);
    } finally {
      setCargando(false);
    }
  }

  return (
    <View style={estilos.contenedor}>
      <Text style={estilos.titulo}>Iniciar sesión</Text>

      <TextInput
        style={estilos.input}
        placeholder="Correo"
        placeholderTextColor="#666"
        value={correo}
        onChangeText={setCorreo}
        autoCapitalize="none"
        keyboardType="email-address"
      />
      <TextInput
        style={estilos.input}
        placeholder="Contraseña"
        placeholderTextColor="#666"
        value={contrasena}
        onChangeText={setContrasena}
        secureTextEntry
      />

      <TouchableOpacity
        style={estilos.boton}
        onPress={manejarLogin}
        disabled={cargando}
      >
        <Text style={estilos.textoBoton}>
          {cargando ? 'Ingresando...' : 'Ingresar'}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const estilos = StyleSheet.create({
  contenedor: {
    flex: 1,
    backgroundColor: '#12121e',
    justifyContent: 'center',
    padding: 24,
  },
  titulo: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 24,
    textAlign: 'center',
  },
  input: {
    backgroundColor: '#1e1e2e',
    color: '#fff',
    padding: 14,
    borderRadius: 10,
    marginBottom: 14,
  },
  boton: {
    backgroundColor: '#4ade80',
    padding: 14,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 8,
  },
  textoBoton: {
    color: '#12121e',
    fontWeight: 'bold',
    fontSize: 16,
  },
});