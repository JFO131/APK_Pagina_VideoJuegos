// Formulario para crear una cuenta nueva.

import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { registrarUsuario } from '../services/api';

export default function RegistroScreen({ navigation }) {
  const [nombre, setNombre] = useState('');
  const [correo, setCorreo] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [cargando, setCargando] = useState(false);

  async function manejarRegistro() {
    // Validación básica antes de llamar al API
    if (!nombre || !correo || !contrasena) {
      Alert.alert('Campos incompletos', 'Por favor llena todos los campos');
      return;
    }

    if (!correo.includes('@')) {
      Alert.alert('Correo inválido', 'Escribe un correo válido');
      return;
    }

    if (contrasena.length < 6) {
      Alert.alert('Contraseña muy corta', 'Debe tener al menos 6 caracteres');
      return;
    }

    try {
      setCargando(true);
      await registrarUsuario(nombre, correo, contrasena);
      Alert.alert('Cuenta creada', 'Ahora puedes iniciar sesión', [
        { text: 'OK', onPress: () => navigation.navigate('Login') }
      ]);
    } catch (error) {
      Alert.alert('Error', error.message);
    } finally {
      setCargando(false);
    }
  }

  return (
    <View style={estilos.contenedor}>
      <Text style={estilos.titulo}>Crear cuenta</Text>

      <TextInput
        style={estilos.input}
        placeholder="Nombre"
        placeholderTextColor="#666"
        value={nombre}
        onChangeText={setNombre}
      />
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
        onPress={manejarRegistro}
        disabled={cargando}
      >
        <Text style={estilos.textoBoton}>
          {cargando ? 'Creando cuenta...' : 'Registrarme'}
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