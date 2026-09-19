// constants/generos.js
// Asocia cada género con un ícono, para dibujar las portadas
// sin depender de imágenes descargadas de internet.

export const iconoPorGenero = {
  'Acción': 'flash',
  'Aventura': 'compass',
  'RPG': 'shield',
  'Deportes': 'football',
  'Shooter': 'locate',
  'Simulación': 'home',
  'Plataformas': 'trail-sign',
  'Sandbox': 'cube',
  'Roguelike': 'skull',
  'Carreras': 'car-sport',
  'MOBA': 'people',
  'Metroidvania': 'bug',
  'Fiesta': 'happy',
  'Battle Royale': 'planet',
};

export function obtenerIcono(genero) {
  return iconoPorGenero[genero] || 'game-controller';
}