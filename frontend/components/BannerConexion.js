// Muestra un aviso en la parte superior de la pantalla según el estado de conexión.

import { View, Text, StyleSheet } from 'react-native';

// estado puede ser: 'offline', 'sincronizando', o null (no muestra nada)
export default function BannerConexion({ estado }) {
  if (!estado) return null;

  const esOffline = estado === 'offline';

  return (
    <View style={[estilos.banner, esOffline ? estilos.offline : estilos.sincronizando]}>
      <Text style={estilos.texto}>
        {esOffline
          ? '📴 No tienes conexión a Internet. La aplicación está funcionando en modo offline.'
          : '🔄 Conexión recuperada. Sincronizando datos...'}
      </Text>
    </View>
  );
}

const estilos = StyleSheet.create({
  banner: {
    padding: 10,
    alignItems: 'center',
  },
  offline: {
    backgroundColor: '#7f1d1d',
  },
  sincronizando: {
    backgroundColor: '#1e3a5f',
  },
  texto: {
    color: '#fff',
    fontSize: 12,
    textAlign: 'center',
  },
});