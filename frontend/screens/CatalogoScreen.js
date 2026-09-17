// screens/CatalogoScreen.js
// Pantalla que muestra el catálogo. Funciona online (trae datos del backend
// y los guarda localmente) y offline (lee lo último guardado en SQLite).

import { useState, useEffect } from 'react';
import { View, FlatList, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { obtenerJuegos } from '../services/api';
import { guardarCatalogoLocal, obtenerCatalogoLocal } from '../database/sqlite';
import { hayConexion, escucharCambiosDeConexion } from '../services/conexion';
import JuegoCard from '../components/JuegoCard';
import BannerConexion from '../components/BannerConexion';

export default function CatalogoScreen({ navigation }) {
  const [juegos, setJuegos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);
  const [estadoBanner, setEstadoBanner] = useState(null);

  useEffect(() => {
    cargarJuegos();

    // Escuchamos cambios de conexión mientras el usuario está en esta pantalla
    const dejarDeEscuchar = escucharCambiosDeConexion((conectado) => {
      if (conectado) {
        setEstadoBanner('sincronizando');
        cargarJuegos(); // al volver la conexión, refrescamos el catálogo
        setTimeout(() => setEstadoBanner(null), 2000);
      } else {
        setEstadoBanner('offline');
      }
    });

    return dejarDeEscuchar; // se ejecuta al salir de la pantalla
  }, []);

  async function cargarJuegos() {
    try {
      setCargando(true);
      const conectado = await hayConexion();

      if (conectado) {
        // Online: pedimos al backend y actualizamos la copia local
        const datos = await obtenerJuegos();
        setJuegos(datos);
        guardarCatalogoLocal(datos);
        setError(null);
      } else {
        // Offline: leemos lo que ya teníamos guardado en el celular
        const datosLocales = obtenerCatalogoLocal();
        setJuegos(datosLocales);
        setEstadoBanner('offline');
        setError(datosLocales.length === 0 ? 'No hay catálogo guardado localmente todavía.' : null);
      }
    } catch (err) {
      // Si falla la petición al backend, intentamos con lo local como respaldo
      const datosLocales = obtenerCatalogoLocal();
      setJuegos(datosLocales);
      setError(datosLocales.length === 0 ? 'No se pudo cargar el catálogo.' : null);
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

  return (
    <View style={estilos.contenedor}>
      <BannerConexion estado={estadoBanner} />

      {error ? (
        <View style={estilos.centrado}>
          <Text style={estilos.textoError}>{error}</Text>
        </View>
      ) : (
        <FlatList
          data={juegos}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={{ padding: 12 }}
          renderItem={({ item }) => (
            <JuegoCard
              juego={item}
              alPresionar={() => navigation.navigate('DetalleJuego', { juegoId: item.id })}
            />
          )}
        />
      )}
    </View>
  );
}

const estilos = StyleSheet.create({
  contenedor: {
    flex: 1,
    backgroundColor: '#12121e',
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