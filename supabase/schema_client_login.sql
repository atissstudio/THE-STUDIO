-- Añade el permiso que falta para que un cliente pueda vincular su propio login
-- la primera vez que entra al portal (por email, solo si nadie lo ha vinculado ya).
-- Ejecutar UNA VEZ en el SQL Editor de Supabase, después de supabase/schema.sql.

create policy "cliente se vincula por email la primera vez" on clientes
  for update using (
    auth_user_id is null and email = auth.jwt() ->> 'email'
  )
  with check (
    auth_user_id = auth.uid() and email = auth.jwt() ->> 'email'
  );

-- ═════════════════════════════════════════════════════════════
-- AJUSTE EN EL PANEL DE SUPABASE (no es SQL, hay que tocarlo a mano)
--
-- Authentication → Sign In / Providers → Email:
--   Desactivar "Confirm email".
--
-- Por qué: el portal entra por contraseña (/portal/login) para que haya la
-- menor fricción posible. Con la confirmación activada, al crear cuenta
-- Supabase no devuelve sesión y obliga a salir al buzón, que es justo lo que
-- se quería evitar. Quién puede entrar no depende de eso: lo decide tener
-- ficha en la tabla `clientes` (ver requireClient en src/lib).
-- ═════════════════════════════════════════════════════════════
