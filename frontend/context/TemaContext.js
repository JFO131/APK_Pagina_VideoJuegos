// context/TemaContext.js
// Guarda si el usuario prefiere tema oscuro o claro, y lo recuerda
// entre sesiones usando AsyncStorage.

import { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { temaOscuro, temaClaro } from '../constants/temas';

const CLAVE_TEMA = 'tema_preferido';
const TemaContext = createContext(null);

export function TemaProvider({ children }) {
  const [esOscuro, setEsOscuro] = useState(true);

  useEffect(() => {
    AsyncStorage.getItem(CLAVE_TEMA).then((valorGuardado) => {
      if (valorGuardado === 'claro') setEsOscuro(false);
    });
  }, []);

  async function cambiarTema() {
    const nuevoValor = !esOscuro;
    setEsOscuro(nuevoValor);
    await AsyncStorage.setItem(CLAVE_TEMA, nuevoValor ? 'oscuro' : 'claro');
  }

  const colores = esOscuro ? temaOscuro : temaClaro;

  return (
    <TemaContext.Provider value={{ colores, esOscuro, cambiarTema }}>
      {children}
    </TemaContext.Provider>
  );
}

export function useTema() {
  return useContext(TemaContext);
}