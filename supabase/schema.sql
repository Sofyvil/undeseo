-- Esquema de base de datos para "Un Deseo"
-- Cómo usar este archivo: Supabase > tu proyecto > SQL Editor > pegar todo esto > Run

-- Extensión para generar IDs únicos
create extension if not exists "pgcrypto";

-- Catálogo propio de Go Baby (productos que se pueden agregar con un clic)
create table store_products (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  price numeric,
  image_url text,
  product_url text,
  icon text,
  active boolean default true,
  created_at timestamptz default now()
);

-- Listas de regalos
create table lists (
  id uuid primary key default gen_random_uuid(),
  owner_token text not null default encode(gen_random_bytes(16), 'hex'), -- clave secreta del organizador (MVP sin login)
  owner_email text not null, -- para poder recuperar el acceso si se pierde el link
  parents_name text not null,
  event_type text not null default 'baby_shower', -- baby_shower | nacimiento | cumple | otro
  event_date date,
  event_time time,
  event_location text,
  flyer_image_url text,
  created_at timestamptz default now()
);

-- Regalos dentro de cada lista
create table items (
  id uuid primary key default gen_random_uuid(),
  list_id uuid not null references lists(id) on delete cascade,
  name text not null,
  price numeric,
  details text, -- talle, color, u otras aclaraciones opcionales
  image_url text,
  product_url text,
  source text not null default 'link', -- 'link' | 'catalog'
  reserved boolean default false,
  reserved_by text,
  reserved_at timestamptz,
  confirmed boolean default false,
  created_at timestamptz default now()
);

-- Seguridad: solo se puede leer/escribir con el link correcto
-- (por ahora, reglas simples para el MVP; se puede endurecer más adelante)
alter table lists enable row level security;
alter table items enable row level security;
alter table store_products enable row level security;

create policy "cualquiera puede leer listas" on lists for select using (true);
create policy "cualquiera puede crear listas" on lists for insert with check (true);
create policy "cualquiera puede actualizar listas" on lists for update using (true);
create policy "cualquiera puede leer items" on items for select using (true);
create policy "cualquiera puede crear items" on items for insert with check (true);
create policy "cualquiera puede actualizar items (reservar)" on items for update using (true);
create policy "cualquiera puede leer el catálogo" on store_products for select using (true);
