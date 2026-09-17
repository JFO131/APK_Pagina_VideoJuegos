// navigation/AppNavigator.js
// Define las pantallas disponibles y cómo se navega entre ellas.

import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import InicioScreen from '../screens/InicioScreen';
import LoginScreen from '../screens/LoginScreen';
import RegistroScreen from '../screens/RegistroScreen';
import CatalogoScreen from '../screens/CatalogoScreen';

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
          options={{ title: 'Tienda de Videojuegos' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}