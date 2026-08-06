// @ts-check
import { defineConfig, envField } from "astro/config";
import sitemap from "@astrojs/sitemap";
import vercel from "@astrojs/vercel";
import { servicios } from "./src/data/servicios.ts";

// Dominio provisional (subdominio de Vercel) hasta que se elija el dominio propio — CLAUDE.md §6.
// Corregido 2026-08-05: apuntaba a "the-studio-atis", que no existe (404). El proyecto
// real de Vercel sirve en "the-studio-delta", así que canonical, og:image y sitemap
// estaban señalando a un dominio muerto (sin previsualización al compartir el enlace).
const SITE_URL = "https://the-studio-delta.vercel.app";

// https://astro.build/config
export default defineConfig({
  site: SITE_URL,
  integrations: [
    sitemap({
      /*
        Las 7 páginas de servicio se listan a mano porque, al renderizar en
        servidor, el sitemap ya no puede deducirlas de getStaticPaths y se
        caían del índice (justo las páginas que más interesa posicionar).
        Salen de src/data/servicios.ts, que sigue siendo la única fuente.
      */
      customPages: servicios.map((s) => new URL(`/servicios/${s.slug}`, SITE_URL).toString()),
      filter: (page) =>
        !page.includes("/maqueta") &&
        !page.includes("/portal/") &&
        !page.includes("/admin") &&
        // La pantalla de la cortina de acceso no debe indexarse.
        !page.includes("/entrar"),
    }),
  ],
  /*
    output "server": las páginas se generan en el servidor a cada visita, en vez
    de quedar congeladas en el build.

    Es lo que hace posible la cortina de acceso (src/middleware.ts). Con el modo
    estático anterior, Astro NO ejecuta el middleware para las páginas ya
    generadas — comprobado el 2026-08-05, la home se servía sin pedir nada — así
    que la cortina no habría tapado el sitio y lo habríamos dado por protegido
    sin estarlo.

    Coste: cada visita ejecuta una función en Vercel en vez de servir un archivo
    ya hecho. Para el tráfico de hoy es irrelevante y entra de sobra en el plan
    gratuito. El día del lanzamiento, al quitar la cortina, se puede volver a
    "static" si interesa el máximo de velocidad.
  */
  output: "server",
  adapter: vercel(),
  /*
    Secretos del servidor, declarados (2026-08-06).

    Hacía falta porque `import.meta.env` NO se lee al ejecutarse: Vite lo
    sustituye al compilar. La contraseña de la cortina acababa incrustada como
    texto en el artefacto del build, y en Vercel —donde no hay `.env`— quedaba
    en `undefined` y la cortina se abría sola. Con `astro:env` en `context:
    "server"` y `access: "secret"`, el valor se lee del entorno de la función
    en cada petición, nunca se incrusta y nunca llega al navegador.

    `optional: true` porque el día del lanzamiento la variable desaparece; la
    ausencia la trata el middleware, que ahora cierra en vez de abrir.
  */
  env: {
    schema: {
      SITE_GATE_PASSWORD: envField.string({
        context: "server",
        access: "secret",
        optional: true,
      }),
      SITE_PUBLIC: envField.string({ context: "server", access: "secret", optional: true }),
    },
  },
});
