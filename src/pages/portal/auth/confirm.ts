import type { APIRoute } from "astro";
import { createSupabaseServerClient } from "../../../lib/supabase";

export const prerender = false;

// Destino del enlace mágico que Supabase manda por correo (signInWithOtp).
// Con PKCE (por defecto en proyectos nuevos de Supabase) el enlace trae `?code=...`;
// el formato antiguo `token_hash`/`type` se soporta también por si el proyecto usa ese flujo.
export const GET: APIRoute = async ({ url, request, cookies, redirect }) => {
  const code = url.searchParams.get("code");
  const token_hash = url.searchParams.get("token_hash");
  const type = url.searchParams.get("type");

  const supabase = createSupabaseServerClient(request, cookies);

  if (code) {
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) return redirect("/portal");
  } else if (token_hash && type) {
    const { error } = await supabase.auth.verifyOtp({ token_hash, type: type as "email" | "magiclink" });
    if (!error) return redirect("/portal");
  }

  return redirect("/portal/login?error=enlace-invalido");
};
