// constants/imagenesJuegos.js
// Asocia el nombre de cada videojuego con su imagen local.
// Catálogo completo de los 26 videojuegos con sus carátulas locales optimizadas.

export const imagenesJuegos = {
  Minecraft: require('../assets/juegos/minecraft.jpg'),
  'The Legend of Zelda: Breath of the Wild': require('../assets/juegos/zelda-botw.jpg'),
  'God of War Ragnarök': require('../assets/juegos/god-of-war-ragnarok.jpg'),
  'EA Sports FC 24': require('../assets/juegos/ea-sports-fc-24.jpg'),
  'Grand Theft Auto V': require('../assets/juegos/grand-theft-auto-v.jpg'),
  'The Witcher 3: Wild Hunt': require('../assets/juegos/the-witcher-3.jpg'),
  'Among Us': require('../assets/juegos/among-us.jpg'),
  Fortnite: require('../assets/juegos/fortnite.jpg'),
  'Call of Duty: Modern Warfare III': require('../assets/juegos/call-of-duty-mwiii.jpg'),
  'Animal Crossing: New Horizons': require('../assets/juegos/animal-crossing.jpg'),
  'Super Mario Odyssey': require('../assets/juegos/super-mario-odyssey.jpg'),
  'Red Dead Redemption 2': require('../assets/juegos/red-dead-redemption-2.jpg'),
  'Stardew Valley': require('../assets/juegos/stardew-valley.jpg'),
  Hades: require('../assets/juegos/hades.jpg'),
  'Cyberpunk 2077': require('../assets/juegos/cyberpunk-2077.jpg'),
  'Elden Ring': require('../assets/juegos/elden-ring.jpg'),
  'Mario Kart 8 Deluxe': require('../assets/juegos/mario-kart-8.jpg'),
  'Overwatch 2': require('../assets/juegos/overwatch-2.jpg'),
  'League of Legends': require('../assets/juegos/league-of-legends.jpg'),
  Valorant: require('../assets/juegos/valorant.jpg'),
  'Minecraft Dungeons': require('../assets/juegos/minecraft-dungeons.jpg'),
  Terraria: require('../assets/juegos/terraria.jpg'),
  'Rocket League': require('../assets/juegos/rocket-league.jpg'),
  'Hollow Knight': require('../assets/juegos/hollow-knight.jpg'),
  Celeste: require('../assets/juegos/celeste.jpg'),
  'It Takes Two': require('../assets/juegos/it-takes-two.jpg'),
};

export function obtenerImagenLocal(nombreJuego) {
  return imagenesJuegos[nombreJuego] || null;
}