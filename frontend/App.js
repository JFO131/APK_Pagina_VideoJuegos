// App.js
import { useEffect } from 'react';
import AppNavigator from './navigation/AppNavigator';
import { inicializarBaseLocal } from './database/sqlite';
import { TemaProvider } from './context/TemaContext';

export default function App() {
  useEffect(() => {
    inicializarBaseLocal();
  }, []);

  return (
    <TemaProvider>
      <AppNavigator />
    </TemaProvider>
  );
}