// screens/CambiarContrasenaScreen.js
import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { obtenerSesion } from '../services/sesion';
import { cambiarContrasena } from '../services/api';
import { useTema } from '../context/TemaContext';

export default function CambiarContrasenaScreen({ navigation }) {
  const { colores } = useTema();
  const [actual, setActual] = useState('');
  const [nueva, setNueva] = useState('');
  const [confirmacion, setConfirmacion] = useState('');
  const [guardando, setGuardando] = useState(false);

  async function manejarGuardar() {
    if (!actual || !nueva || !confirmacion) {
      Alert.alert('Campos incompletos', 'Completa los tres campos');
      return;
    }
    if (nueva !== confirmacion) {
      Alert.alert('No coinciden', 'La nueva contraseña y su confirmación deben ser iguales');
      return;
    }
    if (nueva.length < 6) {
      Alert.alert('Muy corta', 'La nueva contraseña debe tener al menos 6 caracteres');
      return;
    }
    try {
      setGuardando(true);
      const sesion = await obtenerSesion();
      await cambiarContrasena(sesion.token, actual, nueva);
      Alert.alert('Listo', 'Tu contraseña se actualizó correctamente', [{ text: 'OK', onPress: () => navigation.goBack() }]);
    } catch (error) {
      Alert.alert('Error', error.message);
    } finally {
      setGuardando(false);
    }
  }

  return (
    <View style={[estilos.contenedor, { backgroundColor: colores.fondo }]}>
      <Text style={[estilos.titulo, { color: colores.texto }]}>Cambiar contraseña</Text>
      <TextInput style={[estilos.input, { backgroundColor: colores.tarjeta, color: colores.texto }]} placeholder="Contraseña actual" placeholderTextColor={colores.textoTenue} value={actual} onChangeText={setActual} secureTextEntry />
      <TextInput style={[estilos.input, { backgroundColor: colores.tarjeta, color: colores.texto }]} placeholder="Nueva contraseña" placeholderTextColor={colores.textoTenue} value={nueva} onChangeText={setNueva} secureTextEntry />
      <TextInput style={[estilos.input, { backgroundColor: colores.tarjeta, color: colores.texto }]} placeholder="Confirmar nueva contraseña" placeholderTextColor={colores.textoTenue} value={confirmacion} onChangeText={setConfirmacion} secureTextEntry />
      <TouchableOpacity style={[estilos.boton, { backgroundColor: colores.primario }]} onPress={manejarGuardar} disabled={guardando}>
        <Text style={{ color: colores.fondo, fontWeight: 'bold', fontSize: 16 }}>{guardando ? 'Guardando...' : 'Cambiar contraseña'}</Text>
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