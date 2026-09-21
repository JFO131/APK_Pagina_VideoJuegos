// screens/LoginScreen.js
import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, KeyboardAvoidingView, ScrollView, Platform } from 'react-native';
import { iniciarSesion } from '../services/api';
import { guardarSesion } from '../services/sesion';
import { useTema } from '../context/TemaContext';
import { tipografia } from '../constants/tipografia';

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
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: colores.fondo }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 60 : 0}
    >
      <ScrollView style={{ flex: 1 }} contentContainerStyle={estilos.contenedor} keyboardShouldPersistTaps="handled">
        <Text style={[estilos.titulo, { color: colores.texto }]}>Iniciar sesión</Text>
        <TextInput style={[estilos.input, { backgroundColor: colores.tarjeta, color: colores.texto }]} placeholder="Correo" placeholderTextColor={colores.textoTenue} value={correo} onChangeText={setCorreo} autoCapitalize="none" keyboardType="email-address" />
        <TextInput style={[estilos.input, { backgroundColor: colores.tarjeta, color: colores.texto }]} placeholder="Contraseña" placeholderTextColor={colores.textoTenue} value={contrasena} onChangeText={setContrasena} secureTextEntry />
        <TouchableOpacity style={[estilos.boton, { backgroundColor: colores.primario }]} onPress={manejarLogin} disabled={cargando}>
          <Text style={{ color: colores.fondo, fontFamily: tipografia.semibold, fontSize: 16 }}>{cargando ? 'Ingresando...' : 'Ingresar'}</Text>
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