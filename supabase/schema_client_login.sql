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
