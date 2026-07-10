// @ts-check
import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";
import vercel from "@astrojs/vercel";

// Dominio provisional (subdominio de Vercel) hasta que se elija el dominio propio — CLAUDE.md §6.
const SITE_URL = "https://the-studio-atis.vercel.app";

// https://astro.build/config
export default defineConfig({
  site: SITE_URL,
  integrations: [sitemap()],
  // output "static" (por defecto) + adapter: todas las páginas se generan estáticas,
  // salvo /api/lead, que se marca con `export const prerender = false`.
  adapter: vercel(),
});
