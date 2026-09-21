// screens/RegistroScreen.js
import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, KeyboardAvoidingView, ScrollView, Platform } from 'react-native';
import { registrarUsuario } from '../services/api';
import { useTema } from '../context/TemaContext';
import { tipografia } from '../constants/tipografia';

export default function RegistroScreen({ navigation }) {
  const { colores } = useTema();
  const [nombre, setNombre] = useState('');
  const [correo, setCorreo] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [cargando, setCargando] = useState(false);

  async function manejarRegistro() {
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
      Alert.alert('Cuenta creada', 'Ahora puedes iniciar sesión', [{ text: 'OK', onPress: () => navigation.navigate('Login') }]);
    } catch (error) {
      Alert.alert('Error', error.message);
    } finally {
      setCargando(false);
    }
  }

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: colores.fondo }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 60 : 0}
    >
      <ScrollView style={{ flex: 1 }} contentContainerStyle={estilos.contenedor} keyboardShouldPersistTaps="handled">
        <Text style={[estilos.titulo, { color: colores.texto }]}>Crear cuenta</Text>
        <TextInput style={[estilos.input, { backgroundColor: colores.tarjeta, color: colores.texto }]} placeholder="Nombre" placeholderTextColor={colores.textoTenue} value={nombre} onChangeText={setNombre} />
        <TextInput style={[estilos.input, { backgroundColor: colores.tarjeta, color: colores.texto }]} placeholder="Correo" placeholderTextColor={colores.textoTenue} value={correo} onChangeText={setCorreo} autoCapitalize="none" keyboardType="email-address" />
        <TextInput style={[estilos.input, { backgroundColor: colores.tarjeta, color: colores.texto }]} placeholder="Contraseña" placeholderTextColor={colores.textoTenue} value={contrasena} onChangeText={setContrasena} secureTextEntry />
        <TouchableOpacity style={[estilos.boton, { backgroundColor: colores.primario }]} onPress={manejarRegistro} disabled={cargando}>
          <Text style={{ color: colores.fondo, fontFamily: tipografia.semibold, fontSize: 16 }}>{cargando ? 'Creando cuenta...' : 'Registrarme'}</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const estilos = StyleSheet.create({
  contenedor: { flexGrow: 1, justifyContent: 'center', padding: 24 },
  titulo: { fontSize: 24, fontFamily: tipografia.bold, marginBottom: 24, textAlign: 'center' },
  input: { padding: 14, borderRadius: 10, marginBottom: 14, fontFamily: tipografia.regular },
  boton: { padding: 14, borderRadius: 10, alignItems: 'center', marginTop: 8 },
});