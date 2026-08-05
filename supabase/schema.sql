-- The Studio, by Atis — portal interno (admin) + portal de cliente.
-- Pega esto entero en Supabase → SQL Editor → Run.
-- Después, crea el usuario admin a mano en Authentication → Users (ver nota al final).

-- ─────────────────────────────────────────────────────────────
-- clientes: ficha real de cada cliente. Fuente de verdad operativa
-- (Notion sigue siendo la fuente de lo estratégico, no se duplica aquí).
-- ─────────────────────────────────────────────────────────────
create table clientes (
  id uuid primary key default gen_random_uuid(),
  auth_user_id uuid references auth.users (id), -- null hasta que el cliente tenga login propio
  nombre text not null,
  empresa text,
  email text not null,
  telefono text,
  estado text not null default 'activo' check (estado in ('prospecto', 'activo', 'pausado', 'finalizado')),
  notas text,
  created_at timestamptz not null default now()
);

-- ─────────────────────────────────────────────────────────────
-- documentos: lo que Alejandro publica a cada cliente (informes, entregables...).
-- ─────────────────────────────────────────────────────────────
create table documentos (
  id uuid primary key default gen_random_uuid(),
  cliente_id uuid not null references clientes (id) on delete cascade,
  titulo text not null,
  storage_path text not null, -- ruta dentro del bucket de Supabase Storage
  tipo text not null default 'informe' check (tipo in ('informe', 'contrato', 'entregable', 'otro')),
  publicado_at timestamptz not null default now()
);

-- ─────────────────────────────────────────────────────────────
-- facturas: generadas desde el propio portal.
-- Datos fiscales de la cooperativa siguen "por confirmar" (CLAUDE.md §6) —
-- razon_social_emisor y cif_emisor se rellenan cuando la cooperativa esté constituida.
-- ─────────────────────────────────────────────────────────────
create table facturas (
  id uuid primary key default gen_random_uuid(),
  cliente_id uuid not null references clientes (id) on delete cascade,
  numero text not null unique, -- correlativo, ej. 2026-001
  concepto text not null,
  importe numeric(10, 2) not null,
  estado text not null default 'pendiente' check (estado in ('pendiente', 'pagada', 'vencida', 'anulada')),
  fecha_emision date not null default current_date,
  fecha_vencimiento date,
  pdf_storage_path text, -- se rellena al generar el PDF
  created_at timestamptz not null default now()
);

-- ─────────────────────────────────────────────────────────────
-- Row Level Security: el admin (tú) ve todo; cada cliente ve solo lo suyo.
-- ─────────────────────────────────────────────────────────────
alter table clientes enable row level security;
alter table documentos enable row level security;
alter table facturas enable row level security;

-- Nota: "admin" se identifica por email, no por tabla de roles aparte —
-- un único usuario admin no justifica esa complejidad todavía.
create or replace function is_admin()
returns boolean
language sql
stable
as $$
  select coalesce(auth.jwt() ->> 'email', '') = 'atisdev@atis.studio';
$$;

create policy "admin acceso total clientes" on clientes
  for all using (is_admin()) with check (is_admin());

create policy "cliente ve su propia ficha" on clientes
  for select using (auth_user_id = auth.uid());

create policy "admin acceso total documentos" on documentos
  for all using (is_admin()) with check (is_admin());

create policy "cliente ve sus documentos" on documentos
  for select using (
    cliente_id in (select id from clientes where auth_user_id = auth.uid())
  );

create policy "admin acceso total facturas" on facturas
  for all using (is_admin()) with check (is_admin());

create policy "cliente ve sus facturas" on facturas
  for select using (
    cliente_id in (select id from clientes where auth_user_id = auth.uid())
  );

-- ─────────────────────────────────────────────────────────────
-- Índice para el correlativo de facturas por año.
-- ─────────────────────────────────────────────────────────────
create index facturas_numero_idx on facturas (numero);
create index documentos_cliente_idx on documentos (cliente_id);
create index facturas_cliente_idx on facturas (cliente_id);

-- ─────────────────────────────────────────────────────────────
-- Storage: bucket privado para los documentos publicados a clientes.
-- ─────────────────────────────────────────────────────────────
insert into storage.buckets (id, name, public)
values ('documentos', 'documentos', false)
on conflict (id) do nothing;

create policy "admin gestiona documentos storage" on storage.objects
  for all using (bucket_id = 'documentos' and is_admin())
  with check (bucket_id = 'documentos' and is_admin());

create policy "cliente lee sus documentos storage" on storage.objects
  for select using (
    bucket_id = 'documentos'
    and (storage.foldername(name))[1] in (
      select id::text from clientes where auth_user_id = auth.uid()
    )
  );

-- ═════════════════════════════════════════════════════════════
-- SIGUIENTE PASO (a mano, en el panel de Supabase — no por SQL):
-- Authentication → Users → Add user
--   Email:    atisdev@atis.studio   (Supabase exige email, no "usuario" plano)
--   Password: ATIS10
--   Auto Confirm User: sí
--
-- La función is_admin() de arriba compara ese email exacto — si usas otro,
-- actualiza la función a juego.
-- ═════════════════════════════════════════════════════════════
