// screens/LoginScreen.js
import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { iniciarSesion } from '../services/api';
import { guardarSesion } from '../services/sesion';
import { useTema } from '../context/TemaContext';

export default function LoginScreen({ navigation }) {
  const { colores } = useTema();
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
      navigation.reset({ index: 0, routes: [{ name: 'Catalogo' }] });
    } catch (error) {
      Alert.alert('Error', error.message);
    } finally {
      setCargando(false);
    }
  }

  return (
    <View style={[estilos.contenedor, { backgroundColor: colores.fondo }]}>
      <Text style={[estilos.titulo, { color: colores.texto }]}>Iniciar sesión</Text>
      <TextInput style={[estilos.input, { backgroundColor: colores.tarjeta, color: colores.texto }]} placeholder="Correo" placeholderTextColor={colores.textoTenue} value={correo} onChangeText={setCorreo} autoCapitalize="none" keyboardType="email-address" />
      <TextInput style={[estilos.input, { backgroundColor: colores.tarjeta, color: colores.texto }]} placeholder="Contraseña" placeholderTextColor={colores.textoTenue} value={contrasena} onChangeText={setContrasena} secureTextEntry />
      <TouchableOpacity style={[estilos.boton, { backgroundColor: colores.primario }]} onPress={manejarLogin} disabled={cargando}>
        <Text style={{ color: colores.fondo, fontWeight: 'bold', fontSize: 16 }}>{cargando ? 'Ingresando...' : 'Ingresar'}</Text>
      </TouchableOpacity>
    </View>
  );
}

const estilos = StyleSheet.create({
  contenedor: { flex: 1, justifyContent: 'center', padding: 24 },
  titulo: { fontSize: 24, fontWeight: 'bold', marginBottom: 24, textAlign: 'center' },
  input: { padding: 14, borderRadius: 10, marginBottom: 14 },
  boton: { padding: 14, borderRadius: 10, alignItems: 'center', marginTop: 8 },
});