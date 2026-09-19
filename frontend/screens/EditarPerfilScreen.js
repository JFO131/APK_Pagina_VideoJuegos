// screens/EditarPerfilScreen.js
import { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { obtenerSesion, actualizarUsuarioSesion } from '../services/sesion';
import { actualizarPerfil } from '../services/api';
import { useTema } from '../context/TemaContext';

export default function EditarPerfilScreen({ navigation }) {
  const { colores } = useTema();
  const [nombre, setNombre] = useState('');
  const [correo, setCorreo] = useState('');
  const [guardando, setGuardando] = useState(false);
  const [token, setToken] = useState(null);

  useEffect(() => {
    obtenerSesion().then((sesion) => {
      if (sesion) {
        setNombre(sesion.usuario.nombre);
        setCorreo(sesion.usuario.correo);
        setToken(sesion.token);
      }
    });
  }, []);

  async function manejarGuardar() {
    if (!nombre || !correo) {
      Alert.alert('Campos incompletos', 'El nombre y el correo son obligatorios');
      return;
    }
    try {
      setGuardando(true);
      const resultado = await actualizarPerfil(token, nombre, correo);
      await actualizarUsuarioSesion(resultado.usuario);
      Alert.alert('Listo', 'Tu perfil se actualizó correctamente', [{ text: 'OK', onPress: () => navigation.goBack() }]);
    } catch (error) {
      Alert.alert('Error', error.message);
    } finally {
      setGuardando(false);
    }
  }

  return (
    <View style={[estilos.contenedor, { backgroundColor: colores.fondo }]}>
      <Text style={[estilos.titulo, { color: colores.texto }]}>Editar perfil</Text>
      <TextInput style={[estilos.input, { backgroundColor: colores.tarjeta, color: colores.texto }]} placeholder="Nombre" placeholderTextColor={colores.textoTenue} value={nombre} onChangeText={setNombre} />
      <TextInput style={[estilos.input, { backgroundColor: colores.tarjeta, color: colores.texto }]} placeholder="Correo" placeholderTextColor={colores.textoTenue} value={correo} onChangeText={setCorreo} autoCapitalize="none" keyboardType="email-address" />
      <TouchableOpacity style={[estilos.boton, { backgroundColor: colores.primario }]} onPress={manejarGuardar} disabled={guardando}>
        <Text style={{ color: colores.fondo, fontWeight: 'bold', fontSize: 16 }}>{guardando ? 'Guardando...' : 'Guardar cambios'}</Text>
      </TouchableOpacity>
    </View>
  );
}

const estilos = StyleSheet.create({
  contenedor: { flex: 1, padding: 24, paddingTop: 40 },
  titulo: { fontSize: 22, fontWeight: 'bold', marginBottom: 24 },
  input: { padding: 14, borderRadius: 10, marginBottom: 14 },
  boton: { padding: 14, borderRadius: 10, alignItems: 'center', marginTop: 8 },
});