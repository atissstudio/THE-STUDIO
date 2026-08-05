import type { AstroGlobal } from "astro";
import { createSupabaseServerClient } from "./supabase";

// Sesión del cliente en /portal/*. A diferencia del admin, un cliente se identifica
// por su ficha en la tabla `clientes`, vinculada a su login la primera vez que entra
// (ver supabase/schema_client_login.sql — RLS solo deja vincularse por email propio).
export async function requireClient(Astro: AstroGlobal) {
  const supabase = createSupabaseServerClient(Astro.request, Astro.cookies);
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { redirect: Astro.redirect("/portal/login"), supabase: null, cliente: null };
  }

  let { data: cliente } = await supabase.from("clientes").select("*").eq("auth_user_id", user.id).maybeSingle();

  if (!cliente) {
    const { data: linked } = await supabase
      .from("clientes")
      .update({ auth_user_id: user.id })
      .eq("email", user.email)
      .is("auth_user_id", null)
      .select()
      .maybeSingle();
    cliente = linked ?? null;
  }

  if (!cliente) {
    await supabase.auth.signOut();
    return { redirect: Astro.redirect("/portal/login?error=sin-acceso"), supabase: null, cliente: null };
  }

  return { redirect: null, supabase, cliente };
}
