// screens/CuentaScreen.js
import { useState, useCallback } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert, Switch } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { obtenerSesion, cerrarSesion } from '../services/sesion';
import { useTema } from '../context/TemaContext';

export default function CuentaScreen({ navigation }) {
  const { colores, esOscuro, cambiarTema } = useTema();
  const [usuario, setUsuario] = useState(null);

  useFocusEffect(useCallback(() => {
    obtenerSesion().then((sesion) => setUsuario(sesion?.usuario || null));
  }, []));

  function manejarCerrarSesion() {
    Alert.alert('Cerrar sesión', '¿Seguro que quieres salir de tu cuenta?', [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Cerrar sesión', style: 'destructive', onPress: async () => {
        await cerrarSesion();
        navigation.reset({ index: 0, routes: [{ name: 'Inicio' }] });
      }},
    ]);
  }

  if (!usuario) {
    return (
      <View style={[estilos.centrado, { backgroundColor: colores.fondo }]}>
        <Text style={{ color: colores.textoSecundario, fontSize: 15, marginBottom: 16 }}>No has iniciado sesión</Text>
        <TouchableOpacity style={[estilos.botonEntrar, { backgroundColor: colores.primario }]} onPress={() => navigation.navigate('Login')}>
          <Text style={{ color: colores.fondo, fontWeight: 'bold' }}>Iniciar sesión</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={[estilos.contenedor, { backgroundColor: colores.fondo }]}>
      <LinearGradient colors={colores.primarioDegradado} style={estilos.avatar}>
        <Ionicons name="person" size={40} color={colores.fondo} />
      </LinearGradient>

      <Text style={[estilos.nombre, { color: colores.texto }]}>{usuario.nombre}</Text>
      <Text style={{ color: colores.textoSecundario, fontSize: 14, marginTop: 4, marginBottom: 30 }}>{usuario.correo}</Text>

      <View style={[estilos.opciones, { backgroundColor: colores.tarjeta }]}>
        <View style={estilos.opcionFila}>
          <Ionicons name={esOscuro ? 'moon' : 'sunny'} size={20} color={colores.texto} />
          <Text style={[estilos.textoOpcion, { color: colores.texto }]}>Tema {esOscuro ? 'oscuro' : 'claro'}</Text>
          <Switch value={esOscuro} onValueChange={cambiarTema} trackColor={{ true: colores.primario }} />
        </View>

        <TouchableOpacity style={estilos.opcionFila} onPress={() => navigation.navigate('EditarPerfil')}>
          <Ionicons name="person-outline" size={20} color={colores.texto} />
          <Text style={[estilos.textoOpcion, { color: colores.texto }]}>Editar perfil</Text>
          <Ionicons name="chevron-forward" size={18} color={colores.textoSecundario} />
        </TouchableOpacity>

        <TouchableOpacity style={estilos.opcionFila} onPress={() => navigation.navigate('CambiarContrasena')}>
          <Ionicons name="lock-closed-outline" size={20} color={colores.texto} />
          <Text style={[estilos.textoOpcion, { color: colores.texto }]}>Cambiar contraseña</Text>
          <Ionicons name="chevron-forward" size={18} color={colores.textoSecundario} />
        </TouchableOpacity>

        <TouchableOpacity style={estilos.opcionFila} onPress={() => navigation.navigate('HistorialCompras')}>
          <Ionicons name="receipt-outline" size={20} color={colores.texto} />
          <Text style={[estilos.textoOpcion, { color: colores.texto }]}>Historial de compras</Text>
          <Ionicons name="chevron-forward" size={18} color={colores.textoSecundario} />
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={[estilos.botonPeligro, { borderColor: colores.peligro }]} onPress={manejarCerrarSesion}>
        <Ionicons name="log-out-outline" size={18} color={colores.peligro} />
        <Text style={{ color: colores.peligro, fontWeight: 'bold', marginLeft: 8 }}>Cerrar sesión</Text>
      </TouchableOpacity>
    </View>
  );
}

const estilos = StyleSheet.create({
  contenedor: { flex: 1, alignItems: 'center', paddingTop: 50, paddingHorizontal: 20 },
  centrado: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24 },
  avatar: { width: 80, height: 80, borderRadius: 40, justifyContent: 'center', alignItems: 'center', marginBottom: 16 },
  nombre: { fontSize: 20, fontWeight: 'bold' },
  botonEntrar: { paddingVertical: 12, paddingHorizontal: 30, borderRadius: 10 },
  opciones: { width: '100%', borderRadius: 14, marginBottom: 24, overflow: 'hidden' },
  opcionFila: { flexDirection: 'row', alignItems: 'center', padding: 16, gap: 12 },
  textoOpcion: { flex: 1, fontSize: 14 },
  botonPeligro: { flexDirection: 'row', alignItems: 'center', borderWidth: 1, paddingVertical: 12, paddingHorizontal: 24, borderRadius: 10 },
});