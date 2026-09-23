// screens/CatalogoScreen.js
import { useState, useEffect, useMemo } from 'react';
import { View, FlatList, Text, TextInput, TouchableOpacity, ActivityIndicator, StyleSheet, RefreshControl, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { obtenerJuegos } from '../services/api';
import { guardarCatalogoLocal, obtenerCatalogoLocal } from '../database/sqlite';
import { hayConexion, escucharCambiosDeConexion } from '../services/conexion';
import { sincronizarCarritoConServidor, sincronizarComprasPendientes } from '../services/sincronizacion';
import JuegoCard from '../components/JuegoCard';
import BannerConexion from '../components/BannerConexion';
import { useTema } from '../context/TemaContext';
import { tipografia } from '../constants/tipografia';

export default function CatalogoScreen({ navigation }) {
  const { colores } = useTema();
  const [juegos, setJuegos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [refrescando, setRefrescando] = useState(false);
  const [error, setError] = useState(null);
  const [estadoBanner, setEstadoBanner] = useState(null);
  const [busqueda, setBusqueda] = useState('');
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState(null);

  useEffect(() => {
    async function sincronizarAlInicio() {
      const conectado = await hayConexion();
      if (!conectado) {
        setEstadoBanner('offline');
        return;
      }

      setEstadoBanner('sincronizando');
      try {
        await sincronizarCarritoConServidor();
      } catch (error) {
        // Si falla la sincronización, la app mantiene el carrito local y reintenta luego.
      } finally {
        setTimeout(() => setEstadoBanner(null), 2000);
      }
    }

    cargarJuegos();
    sincronizarAlInicio();

    const dejarDeEscuchar = escucharCambiosDeConexion((conectado) => {
      if (conectado) {
        setEstadoBanner('sincronizando');
        Promise.all([
          sincronizarCarritoConServidor(),
          sincronizarComprasPendientes(),
        ])
          .then(([_, comprasSincronizadas]) => {
            if (comprasSincronizadas > 0) {
              Alert.alert('Compra registrada', 'Tu compra pendiente se realizó correctamente cuando volvió la conexión.');
            }
          })
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

  const categorias = useMemo(() => {
    return Array.from(new Set(juegos.map((j) => j.genero))).sort();
  }, [juegos]);

  const juegosFiltrados = useMemo(() => {
    return juegos.filter((juego) => {
      const coincideBusqueda = juego.nombre.toLowerCase().includes(busqueda.toLowerCase());
      const coincideCategoria = !categoriaSeleccionada || juego.genero === categoriaSeleccionada;
      return coincideBusqueda && coincideCategoria;
    });
  }, [juegos, busqueda, categoriaSeleccionada]);

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

      <View style={[estilos.barraBusqueda, { backgroundColor: colores.tarjeta }]}>
        <Ionicons name="search" size={18} color={colores.textoSecundario} />
        <TextInput
          style={[estilos.inputBusqueda, { color: colores.texto }]}
          placeholder="Buscar videojuegos..."
          placeholderTextColor={colores.textoTenue}
          value={busqueda}
          onChangeText={setBusqueda}
        />
        {busqueda.length > 0 && (
          <TouchableOpacity onPress={() => setBusqueda('')}>
            <Ionicons name="close-circle" size={18} color={colores.textoSecundario} />
          </TouchableOpacity>
        )}
      </View>

      <View style={estilos.contenedorFiltros}>
        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          data={['Todos', ...categorias]}
          keyExtractor={(item) => item}
          contentContainerStyle={estilos.listaFiltros}
          renderItem={({ item }) => {
            const activo = item === 'Todos' ? categoriaSeleccionada === null : categoriaSeleccionada === item;
            return (
              <TouchableOpacity
                style={[estilos.chip, { backgroundColor: activo ? colores.primario : colores.tarjeta }]}
                onPress={() => setCategoriaSeleccionada(item === 'Todos' ? null : item)}
              >
                <Text style={[estilos.textoChip, { color: activo ? colores.fondo : colores.textoSecundario }]}>{item}</Text>
              </TouchableOpacity>
            );
          }}
        />
      </View>

      {error ? (
        <View style={estilos.centrado}>
          <Text style={{ color: colores.peligro, fontSize: 16, fontFamily: tipografia.regular }}>{error}</Text>
        </View>
      ) : juegosFiltrados.length === 0 ? (
        <View style={estilos.centrado}>
          <Text style={{ color: colores.textoSecundario, fontSize: 15, fontFamily: tipografia.regular }}>
            No se encontraron juegos con esos filtros
          </Text>
        </View>
      ) : (
        <FlatList
          data={juegosFiltrados}
          keyExtractor={(item) => String(item.id)}
          numColumns={2}
          columnWrapperStyle={estilos.fila}
          contentContainerStyle={estilos.listaContenido}
          ListHeaderComponent={
            <Text style={[estilos.contador, { color: colores.textoSecundario }]}>
              {juegosFiltrados.length} juego{juegosFiltrados.length !== 1 ? 's' : ''} disponible{juegosFiltrados.length !== 1 ? 's' : ''}
            </Text>
          }
          refreshControl={<RefreshControl refreshing={refrescando} onRefresh={manejarRefrescar} tintColor={colores.primario} />}
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
  contenedor: { flex: 1 },
  centrado: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  barraBusqueda: { flexDirection: 'row', alignItems: 'center', marginHorizontal: 12, marginTop: 12, paddingHorizontal: 12, paddingVertical: 10, borderRadius: 12, gap: 8 },
  inputBusqueda: { flex: 1, fontFamily: tipografia.regular, fontSize: 14 },
  contenedorFiltros: { height: 44, marginBottom: 8 },
  listaFiltros: { paddingHorizontal: 12, alignItems: 'center' },
  chip: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20, marginRight: 8 },
  textoChip: { fontFamily: tipografia.medium, fontSize: 12 },
  listaContenido: { paddingHorizontal: 12, paddingBottom: 12 },
  fila: { justifyContent: 'space-between' },
  contador: { fontSize: 13, marginBottom: 12, marginLeft: 4, fontFamily: tipografia.regular },
});