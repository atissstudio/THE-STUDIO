// @ts-check
import { defineConfig, envField } from "astro/config";
import sitemap from "@astrojs/sitemap";
import vercel from "@astrojs/vercel";
import { servicios } from "./src/data/servicios.ts";

/*
  Dominio DEFINITIVO de la agencia (2026-09-16): Alejandro compró atisstudio.org para
  la cooperativa y The Studio vive en el subdominio thestudio. La raíz atisstudio.org
  es de la cooperativa entera — este repositorio NO la reclama nunca.

  De aquí salen el canonical, el og:image y el sitemap, así que este valor es el que
  le dice a Google cuál es la dirección buena. Mientras dijo "the-studio-delta.vercel.app"
  (subdominio provisional de Vercel), el sitio se habría partido entre dos direcciones.
*/
const SITE_URL = "https://thestudio.atisstudio.org";

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
