import type { APIRoute } from "astro";
import { createSupabaseServerClient } from "../../../lib/supabase";

export const prerender = false;

// Destino del enlace mágico que Supabase manda por correo (signInWithOtp).
export const GET: APIRoute = async ({ url, request, cookies, redirect }) => {
  const token_hash = url.searchParams.get("token_hash");
  const type = url.searchParams.get("type");

  if (token_hash && type) {
    const supabase = createSupabaseServerClient(request, cookies);
    const { error } = await supabase.auth.verifyOtp({ token_hash, type: type as "email" | "magiclink" });
    if (!error) {
      return redirect("/portal");
    }
  }

  return redirect("/portal/login?error=enlace-invalido");
};
