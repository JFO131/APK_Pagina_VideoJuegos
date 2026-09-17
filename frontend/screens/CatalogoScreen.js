// screens/CatalogoScreen.js
// Pantalla que muestra el catálogo completo de videojuegos.

import { useState, useEffect } from 'react';
import { View, FlatList, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { obtenerJuegos } from '../services/api';
import JuegoCard from '../components/JuegoCard';

export default function CatalogoScreen({ navigation }) {
  const [juegos, setJuegos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);

  // Este efecto se ejecuta una sola vez, cuando la pantalla se monta.
  useEffect(() => {
    cargarJuegos();
  }, []);

  async function cargarJuegos() {
    try {
      setCargando(true);
      const datos = await obtenerJuegos();
      setJuegos(datos);
      setError(null);
    } catch (err) {
      setError('No se pudo cargar el catálogo. Revisa tu conexión.');
    } finally {
      setCargando(false);
    }
  }

  if (cargando) {
    return (
      <View style={estilos.centrado}>
        <ActivityIndicator size="large" color="#4ade80" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={estilos.centrado}>
        <Text style={estilos.textoError}>{error}</Text>
      </View>
    );
  }

  return (
    <View style={estilos.contenedor}>
      <FlatList
        data={juegos}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <JuegoCard
            juego={item}
            alPresionar={() => navigation.navigate('DetalleJuego', { juegoId: item.id })}
          />
        )}
      />
    </View>
  );
}

const estilos = StyleSheet.create({
  contenedor: {
    flex: 1,
    backgroundColor: '#12121e',
    padding: 12,
  },
  centrado: {
    flex: 1,
    backgroundColor: '#12121e',
    justifyContent: 'center',
    alignItems: 'center',
  },
  textoError: {
    color: '#f87171',
    fontSize: 16,
  },
});
