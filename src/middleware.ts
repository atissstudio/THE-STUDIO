import { defineMiddleware } from "astro:middleware";

/*
  Cortina de acceso REAL (2026-08-05). Sustituye a SiteGate.astro, que era una
  cortina de mentira: pintaba un panel encima con JavaScript y comparaba la
  contraseña en el navegador, así que la contraseña viajaba en el HTML de todas
  las páginas y cualquiera que mirase el código fuente entraba.

  Aquí la contraseña vive solo en el servidor (variable de entorno) y nunca
  llega al navegador. Sin la cookie correcta, la página ni siquiera se envía:
  se responde con una redirección a /entrar.

  Corre como Edge Middleware de Vercel (middlewareMode: "edge" en
  astro.config.mjs), que sí entra en el plan gratuito. Es importante que sea
  "edge": en modo normal el middleware no se ejecutaría para las páginas
  estáticas, que son casi todas, y la cortina no protegería nada.

  Para QUITAR la cortina el día del lanzamiento: borrar la variable
  SITE_GATE_PASSWORD en Vercel. Sin ella, el sitio queda abierto.
*/

export const COOKIE = "atis_gate";

// Rutas que nunca se tapan: la propia pantalla de acceso, los archivos que
// esa pantalla necesita para verse, y las zonas privadas, que ya tienen
// autenticación de verdad contra Supabase (pedirles además la cortina sería
// una segunda contraseña sin ganar nada).
const LIBRES = [/^\/entrar\/?$/, /^\/_astro\//, /^\/_image/, /^\/admin(\/|$)/, /^\/portal(\/|$)/];
const EXTENSION = /\.(ico|svg|png|jpe?g|webp|avif|gif|mp4|webm|woff2?|txt|xml|json|css|js|map)$/i;

// Huella de la contraseña. Lo que se guarda en la cookie no es la contraseña
// en claro, sino su hash, para que no viaje en cada petición.
export async function huella(password: string): Promise<string> {
  const datos = new TextEncoder().encode(`atis-gate:${password}`);
  const hash = await crypto.subtle.digest("SHA-256", datos);
  return Array.from(new Uint8Array(hash))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

export const onRequest = defineMiddleware(async (context, next) => {
  /*
    Al compilar, Astro ejecuta también el middleware para generar las páginas
    estáticas. Ahí no hay visitante ni cookie, así que sin esta salida cada
    página se guardaba en disco como una redirección a /entrar y el sitio
    entero quedaba destruido en el build (comprobado: la home pasaba a pesar
    360 bytes).

    Se distingue por la cabecera "host": toda petición real de un navegador la
    trae, y al prerenderizar no hay cabeceras. No se usa `isPrerendered`
    porque marca como prerenderizada cualquier ruta estática, también cuando
    la pide un visitante de verdad, y entonces la cortina no taparía nada.
  */
  if (!context.request.headers.get("host")) return next();

  const password = import.meta.env.SITE_GATE_PASSWORD;

  // Sin contraseña configurada, el sitio es público (así se lanza).
  if (!password) return next();

  const ruta = context.url.pathname;
  if (LIBRES.some((r) => r.test(ruta)) || EXTENSION.test(ruta)) return next();

  if (context.cookies.get(COOKIE)?.value === (await huella(password))) return next();

  // Se recuerda a dónde quería ir para devolverlo ahí después de acertar.
  const destino = ruta + context.url.search;
  return context.redirect(`/entrar?volver=${encodeURIComponent(destino)}`);
});
