// App.js
// Punto de entrada de la aplicación.

import { useEffect } from 'react';
import AppNavigator from './navigation/AppNavigator';
import { inicializarBaseLocal } from './database/sqlite';

export default function App() {
  useEffect(() => {
    inicializarBaseLocal();
  }, []);

  return <AppNavigator />;
}