// App.js
import { useEffect, useCallback } from 'react';
import { View } from 'react-native';
import * as SplashScreen from 'expo-splash-screen';
import {
  useFonts,
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold,
} from '@expo-google-fonts/inter';
import AppNavigator from './navigation/AppNavigator';
import { inicializarBaseLocal } from './database/sqlite';
import { TemaProvider } from './context/TemaContext';

// Mantiene la pantalla de carga visible hasta que la fuente esté lista
SplashScreen.preventAutoHideAsync();

export default function App() {
  const [fuentesListas] = useFonts({
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
  });

  useEffect(() => {
    inicializarBaseLocal();
  }, []);

  const alTerminarDeCargar = useCallback(async () => {
    if (fuentesListas) {
      await SplashScreen.hideAsync();
    }
  }, [fuentesListas]);

  if (!fuentesListas) {
    return null; // sigue mostrando el splash screen
  }

  return (
    <View style={{ flex: 1 }} onLayout={alTerminarDeCargar}>
      <TemaProvider>
        <AppNavigator />
      </TemaProvider>
    </View>
  );
}