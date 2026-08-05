import { createServerClient, parseCookieHeader } from "@supabase/ssr";
import type { AstroCookies } from "astro";

// Cliente Supabase para páginas SSR (/admin/*, /portal/*). Usa la sesión vía cookies,
// nunca localStorage — así el login sobrevive a un refresh y funciona en servidor.
export function createSupabaseServerClient(request: Request, cookies: AstroCookies) {
  const url = import.meta.env.SUPABASE_URL;
  const anonKey = import.meta.env.SUPABASE_ANON_KEY;

  if (!url || !anonKey) {
    throw new Error("Faltan SUPABASE_URL o SUPABASE_ANON_KEY en las variables de entorno.");
  }

  return createServerClient(url, anonKey, {
    cookies: {
      getAll() {
        return parseCookieHeader(request.headers.get("Cookie") ?? "");
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value, options }) => {
          cookies.set(name, value, { ...options, path: "/" });
        });
      },
    },
  });
}
