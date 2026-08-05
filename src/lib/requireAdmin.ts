import type { AstroGlobal } from "astro";
import { createSupabaseServerClient } from "./supabase";

// Un único admin identificado por email — sin tabla de roles, no hay más de un usuario
// interno todavía (ver supabase/schema.sql, is_admin()).
const ADMIN_EMAIL = "atisdev@atis.studio";

// Comprueba la sesión y redirige a /admin/login si no hay usuario o no es el admin.
// Devuelve null si ya redirigió (el caller debe `return` inmediatamente en ese caso).
export async function requireAdmin(Astro: AstroGlobal) {
  const supabase = createSupabaseServerClient(Astro.request, Astro.cookies);
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user || user.email !== ADMIN_EMAIL) {
    return { redirect: Astro.redirect("/admin/login"), supabase: null, user: null };
  }

  return { redirect: null, supabase, user };
}
