-- Migración: productos patrocinados
-- Cómo usar: Supabase > tu proyecto > SQL Editor > pegar todo esto > Run
-- (Este archivo es solo la parte nueva, no reemplaza schema.sql)

create table sponsored_products (
  id uuid primary key default gen_random_uuid(),
  brand_name text not null,
  product_name text not null,
  image_url text,
  product_url text not null,
  event_type text, -- null = se muestra para cualquier evento; o baby_shower | nacimiento | cumple | otro
  active boolean default true,
  created_at timestamptz default now()
);

alter table sponsored_products enable row level security;

-- Cualquiera puede ver los productos patrocinados activos (se muestran en /crear).
-- Agregar, editar o desactivar queda reservado al panel de admin, que usa
-- una conexión especial que no depende de estas políticas.
create policy "cualquiera puede leer patrocinados activos" on sponsored_products
  for select using (active = true);
