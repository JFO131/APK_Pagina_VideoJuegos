// navigation/AppNavigator.js
import { View, TouchableOpacity } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import InicioScreen from '../screens/InicioScreen';
import LoginScreen from '../screens/LoginScreen';
import RegistroScreen from '../screens/RegistroScreen';
import CatalogoScreen from '../screens/CatalogoScreen';
import DetalleJuegoScreen from '../screens/DetalleJuegoScreen';
import CarritoScreen from '../screens/CarritoScreen';
import CompraScreen from '../screens/CompraScreen';
import CuentaScreen from '../screens/CuentaScreen';
import EditarPerfilScreen from '../screens/EditarPerfilScreen';
import CambiarContrasenaScreen from '../screens/CambiarContrasenaScreen';
import HistorialComprasScreen from '../screens/HistorialComprasScreen';
import { useTema } from '../context/TemaContext';
import { tipografia } from '../constants/tipografia';

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  const { colores } = useTema();

  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Inicio"
        screenOptions={{
          headerStyle: { backgroundColor: colores.fondo },
          headerTintColor: colores.texto,
          headerTitleStyle: { fontFamily: tipografia.semibold },
        }}
      >
        <Stack.Screen name="Inicio" component={InicioScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Login" component={LoginScreen} options={{ title: 'Iniciar sesión' }} />
        <Stack.Screen name="Registro" component={RegistroScreen} options={{ title: 'Crear cuenta' }} />
        <Stack.Screen
          name="Catalogo"
          component={CatalogoScreen}
          options={({ navigation }) => ({
            title: 'Tienda de Videojuegos',
            headerRight: () => (
              <View style={{ flexDirection: 'row', gap: 16 }}>
                <TouchableOpacity onPress={() => navigation.navigate('Carrito')}>
                  <Ionicons name="cart-outline" size={24} color={colores.primario} />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => navigation.navigate('Cuenta')}>
                  <Ionicons name="person-circle-outline" size={24} color={colores.primario} />
                </TouchableOpacity>
              </View>
            ),
          })}
        />
        <Stack.Screen name="DetalleJuego" component={DetalleJuegoScreen} options={{ title: 'Detalle del juego' }} />
        <Stack.Screen name="Carrito" component={CarritoScreen} options={{ title: 'Mi Carrito' }} />
        <Stack.Screen name="Compra" component={CompraScreen} options={{ title: 'Confirmar Compra' }} />
        <Stack.Screen name="Cuenta" component={CuentaScreen} options={{ title: 'Mi Cuenta' }} />
        <Stack.Screen name="EditarPerfil" component={EditarPerfilScreen} options={{ title: 'Editar perfil' }} />
        <Stack.Screen name="CambiarContrasena" component={CambiarContrasenaScreen} options={{ title: 'Cambiar contraseña' }} />
        <Stack.Screen name="HistorialCompras" component={HistorialComprasScreen} options={{ title: 'Mis compras' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}