// screens/CatalogoScreen.js
import { useState, useEffect } from 'react';
import { View, FlatList, Text, ActivityIndicator, StyleSheet, RefreshControl } from 'react-native';
import { obtenerJuegos } from '../services/api';
import { guardarCatalogoLocal, obtenerCatalogoLocal } from '../database/sqlite';
import { hayConexion, escucharCambiosDeConexion } from '../services/conexion';
import { sincronizarCarritoConServidor } from '../services/sincronizacion';
import JuegoCard from '../components/JuegoCard';
import BannerConexion from '../components/BannerConexion';
import { useTema } from '../context/TemaContext';

export default function CatalogoScreen({ navigation }) {
  const { colores } = useTema();
  const [juegos, setJuegos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [refrescando, setRefrescando] = useState(false);
  const [error, setError] = useState(null);
  const [estadoBanner, setEstadoBanner] = useState(null);

  useEffect(() => {
    cargarJuegos();

    const dejarDeEscuchar = escucharCambiosDeConexion((conectado) => {
      if (conectado) {
        setEstadoBanner('sincronizando');
        sincronizarCarritoConServidor()
          .catch(() => {})
          .finally(() => {
            cargarJuegos();
            setTimeout(() => setEstadoBanner(null), 2000);
          });
      } else {
        setEstadoBanner('offline');
      }
    });

    return dejarDeEscuchar;
  }, []);

  async function cargarJuegos() {
    try {
      setCargando(true);
      const conectado = await hayConexion();

      if (conectado) {
        const datos = await obtenerJuegos();
        setJuegos(datos);
        guardarCatalogoLocal(datos);
        setError(null);
      } else {
        const datosLocales = obtenerCatalogoLocal();
        setJuegos(datosLocales);
        setEstadoBanner('offline');
        setError(datosLocales.length === 0 ? 'No hay catálogo guardado localmente todavía.' : null);
      }
    } catch (err) {
      const datosLocales = obtenerCatalogoLocal();
      setJuegos(datosLocales);
      setError(datosLocales.length === 0 ? 'No se pudo cargar el catálogo.' : null);
    } finally {
      setCargando(false);
      setRefrescando(false);
    }
  }

  function manejarRefrescar() {
    setRefrescando(true);
    cargarJuegos();
  }

  if (cargando) {
    return (
      <View style={[estilos.centrado, { backgroundColor: colores.fondo }]}>
        <ActivityIndicator size="large" color={colores.primario} />
      </View>
    );
  }

  return (
    <View style={[estilos.contenedor, { backgroundColor: colores.fondo }]}>
      <BannerConexion estado={estadoBanner} />

      {error ? (
        <View style={[estilos.centrado, { backgroundColor: colores.fondo }]}>
          <Text style={{ color: colores.peligro, fontSize: 16 }}>{error}</Text>
        </View>
      ) : (
        <FlatList
          data={juegos}
          keyExtractor={(item) => item.id.toString()}
          numColumns={2}
          columnWrapperStyle={estilos.fila}
          contentContainerStyle={estilos.listaContenido}
          ListHeaderComponent={
            <Text style={[estilos.contador, { color: colores.textoSecundario }]}>{juegos.length} juegos disponibles</Text>
          }
          refreshControl={<RefreshControl refreshing={refrescando} onRefresh={manejarRefrescar} tintColor={colores.primario} />}
          renderItem={({ item }) => (
            <JuegoCard juego={item} alPresionar={() => navigation.navigate('DetalleJuego', { juegoId: item.id })} />
          )}
        />
      )}
    </View>
  );
}

const estilos = StyleSheet.create({
  contenedor: { flex: 1 },
  centrado: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  listaContenido: { padding: 12 },
  fila: { justifyContent: 'space-between' },
  contador: { fontSize: 13, marginBottom: 12, marginLeft: 4 },
});