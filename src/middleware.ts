import { defineMiddleware } from "astro:middleware";
/*
  Se leen con `astro:env/server`, declaradas en astro.config.mjs. NO se puede
  usar `import.meta.env`: además de sustituirse al compilar, si se accede con
  un índice dinámico Vite incrusta el objeto ENTERO de variables en el bundle,
  con la contraseña dentro en texto plano (comprobado en el artefacto del
  2026-08-06). `astro:env` lo lee del entorno de la función en cada petición.
*/
import { SITE_GATE_PASSWORD, SITE_PUBLIC } from "astro:env/server";

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

  ── CORREGIDO EL 2026-08-06, el sitio llevaba PÚBLICO desde el principio ──

  Dos fallos, y ninguno era visible sin mirar el build:

  1 · La contraseña se leía con `import.meta.env`, que NO se lee al ejecutarse:
      Vite lo sustituye AL COMPILAR. En un build local coge el `.env` y quedaba
      `const password = "..."` incrustado; en Vercel, donde no hay `.env`,
      quedaba `undefined`. Ahora se lee del entorno en tiempo de ejecución, así
      que poner la variable en Vercel surte efecto sin recompilar y el valor no
      se queda grabado en el artefacto.

  2 · Y lo peor: al faltar la contraseña, la cortina se QUITABA ("sin
      contraseña configurada, el sitio es público"). Fallaba en abierto, que
      para una cortina es justo al revés de lo que debe hacer: si falta la
      configuración, lo seguro es cerrar, no abrir. Nadie se entera de una
      cortina que no aparece, y así estuvo.

  Para QUITAR la cortina el día del lanzamiento hay que decirlo EXPRESAMENTE:
  poner `SITE_PUBLIC=true` en Vercel. Borrar la contraseña ya no abre el sitio,
  lo deja cerrado y avisando de que está mal configurado.
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

  // Abrir el sitio al público es una decisión que hay que declarar, no algo
  // que ocurra solo porque falte una variable.
  if (SITE_PUBLIC === "true") return next();

  const ruta = context.url.pathname;
  if (LIBRES.some((r) => r.test(ruta)) || EXTENSION.test(ruta)) return next();

  const password = SITE_GATE_PASSWORD;

  // Mal configurado: se CIERRA. Quedarse fuera se ve enseguida y se arregla;
  // quedarse abierto sin saberlo es lo que pasó y no lo vio nadie.
  if (!password) return context.redirect("/entrar?sinconfigurar=1");

  if (context.cookies.get(COOKIE)?.value === (await huella(password))) return next();

  // Se recuerda a dónde quería ir para devolverlo ahí después de acertar.
  const destino = ruta + context.url.search;
  return context.redirect(`/entrar?volver=${encodeURIComponent(destino)}`);
});
