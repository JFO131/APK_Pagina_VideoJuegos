// Aquí definimos la URL base del backend y las funciones
// que hacen las peticiones HTTP a la API.

// IMPORTANTE: si pruebas en un celular físico o emulador,
// "localhost" no funciona porque apunta al propio celular.
// Debes usar la IP de tu computadora en la red local, ej: "192.168.1.100"
const URL_API = 'https://apk-pagina-videojuegos.onrender.com/api';
const URL_JUEGOS = `${URL_API}/juegos`;

function normalizarNumero(valor) {
  const numero = Number(valor ?? 0);
  return Number.isFinite(numero) ? numero : 0;
}

function normalizarValores(obj) {
  if (Array.isArray(obj)) {
    return obj.map(normalizarValores);
  }

  if (obj && typeof obj === 'object') {
    const salida = {};

    for (const [clave, valor] of Object.entries(obj)) {
      if (['precio', 'precio_unitario', 'total'].includes(clave)) {
        salida[clave] = normalizarNumero(valor);
      } else {
        salida[clave] = normalizarValores(valor);
      }
    }

    return salida;
  }

  return obj;
}

async function leerRespuesta(respuesta) {
  const texto = await respuesta.text();

  try {
    if (!texto) return {};
    return normalizarValores(JSON.parse(texto));
  } catch {
    throw new Error('El servidor devolvió una respuesta no válida');
  }
}

// Trae la lista completa de videojuegos
export async function obtenerJuegos() {
  const respuesta = await fetch(URL_JUEGOS);

  if (!respuesta.ok) {
    throw new Error('No se pudo obtener el catálogo de juegos');
  }

  return await leerRespuesta(respuesta);
}

// Trae el detalle de un solo videojuego por su id
export async function obtenerJuegoPorId(id) {
  const respuesta = await fetch(`${URL_JUEGOS}/${id}`);

  if (!respuesta.ok) {
    throw new Error('No se pudo obtener el videojuego');
  }

  return await leerRespuesta(respuesta);
}

// Registra un nuevo usuario
export async function registrarUsuario(nombre, correo, contrasena) {
  const respuesta = await fetch(`${URL_API}/auth/registro`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ nombre, correo, contrasena }),
  });

  const datos = await leerRespuesta(respuesta);

  if (!respuesta.ok) {
    throw new Error(datos.mensaje || 'No se pudo registrar el usuario');
  }

  return datos;
}

// Inicia sesión y devuelve el token + datos del usuario
export async function iniciarSesion(correo, contrasena) {
  const respuesta = await fetch(`${URL_API}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ correo, contrasena }),
  });

  const datos = await leerRespuesta(respuesta);

  if (!respuesta.ok) {
    throw new Error(datos.mensaje || 'No se pudo iniciar sesión');
  }

  return datos;
}

// Envía al backend los cambios pendientes del carrito
export async function sincronizarCarrito(token, items) {
  const respuesta = await fetch(`${URL_API}/carrito/sincronizar`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ items }),
  });

  const datos = await leerRespuesta(respuesta);

  if (!respuesta.ok) {
    throw new Error(datos.mensaje || 'No se pudo sincronizar el carrito');
  }

  return datos;
}

// Registra la compra en el backend
export async function registrarCompra(token, items) {
  const respuesta = await fetch(`${URL_API}/compras`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ items }),
  });

  const datos = await leerRespuesta(respuesta);

  if (!respuesta.ok) {
    throw new Error(datos.mensaje || 'No se pudo registrar la compra');
  }

  return datos;
}

export async function actualizarPerfil(token, nombre, correo) {
  const respuesta = await fetch(`${URL_API}/auth/perfil`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify({ nombre, correo }),
  });
  const datos = await leerRespuesta(respuesta);
  if (!respuesta.ok) throw new Error(datos.mensaje || 'No se pudo actualizar el perfil');
  return datos;
}

export async function cambiarContrasena(token, contrasenaActual, contrasenaNueva) {
  const respuesta = await fetch(`${URL_API}/auth/contrasena`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify({ contrasenaActual, contrasenaNueva }),
  });
  const datos = await leerRespuesta(respuesta);
  if (!respuesta.ok) throw new Error(datos.mensaje || 'No se pudo cambiar la contraseña');
  return datos;
}

export async function obtenerHistorialCompras(token) {
  const respuesta = await fetch(`${URL_API}/compras`, { headers: { Authorization: `Bearer ${token}` } });
  const datos = await leerRespuesta(respuesta);
  if (!respuesta.ok) throw new Error(datos.mensaje || 'No se pudo obtener el historial');
  return datos;
}