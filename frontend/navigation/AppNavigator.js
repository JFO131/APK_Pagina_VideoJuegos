// Define las pantallas disponibles y cómo se navega entre ellas.

import { TouchableOpacity, Text } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import InicioScreen from '../screens/InicioScreen';
import LoginScreen from '../screens/LoginScreen';
import RegistroScreen from '../screens/RegistroScreen';
import CatalogoScreen from '../screens/CatalogoScreen';
import DetalleJuegoScreen from '../screens/DetalleJuegoScreen';
import CarritoScreen from '../screens/CarritoScreen';

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Inicio"
        screenOptions={{
          headerStyle: { backgroundColor: '#12121e' },
          headerTintColor: '#fff',
        }}
      >
        <Stack.Screen
          name="Inicio"
          component={InicioScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Login"
          component={LoginScreen}
          options={{ title: 'Iniciar sesión' }}
        />
        <Stack.Screen
          name="Registro"
          component={RegistroScreen}
          options={{ title: 'Crear cuenta' }}
        />
        <Stack.Screen
          name="Catalogo"
          component={CatalogoScreen}
          options={({ navigation }) => ({
            title: 'Tienda de Videojuegos',
            headerRight: () => (
              <TouchableOpacity onPress={() => navigation.navigate('Carrito')}>
                <Text style={{ color: '#4ade80', fontSize: 15 }}>🛒 Carrito</Text>
              </TouchableOpacity>
            ),
          })}
        />
        <Stack.Screen
          name="DetalleJuego"
          component={DetalleJuegoScreen}
          options={{ title: 'Detalle del juego' }}
        />
        <Stack.Screen
          name="Carrito"
          component={CarritoScreen}
          options={{ title: 'Mi Carrito' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}