// navigation/AppNavigator.js
// Define las pantallas disponibles y cómo se navega entre ellas.

import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import CatalogoScreen from '../screens/CatalogoScreen';

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Catalogo">
        <Stack.Screen
          name="Catalogo"
          component={CatalogoScreen}
          options={{ title: 'Tienda de Videojuegos' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
