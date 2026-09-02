-- Esquema de base de datos para "Un Deseo"
-- Cómo usar este archivo: Supabase > tu proyecto > SQL Editor > pegar todo esto > Run
-- (Si ya tenías la base armada de antes, no uses este archivo entero —
-- usá la migración específica que te haya pasado Claude en el chat)

-- Extensión para generar IDs únicos
create extension if not exists "pgcrypto";

-- Catálogo propio (productos que se pueden agregar con un clic)
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
  user_id uuid references auth.users(id) on delete cascade, -- dueño real (cuenta con Google o mail)
  owner_email text, -- copia del mail, solo para mostrar/referencia
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

alter table lists enable row level security;
alter table items enable row level security;
alter table store_products enable row level security;

-- Listas: cualquiera puede VER una lista (así funcionan los links a invitados),
-- pero solo el dueño (usuario logueado, dueño real) puede crearla o editarla.
create policy "cualquiera puede leer listas" on lists for select using (true);
create policy "el usuario logueado crea sus propias listas" on lists
  for insert with check (auth.uid() = user_id);
create policy "el dueño puede actualizar su lista" on lists
  for update using (auth.uid() = user_id);

-- Items: cualquiera puede verlos y reservarlos (así funciona la reserva sin
-- login para los invitados). Agregar y borrar regalos queda reservado al
-- dueño de la lista.
create policy "cualquiera puede leer items" on items for select using (true);
create policy "el dueño de la lista agrega items" on items
  for insert with check (
    auth.uid() = (select user_id from lists where id = list_id)
  );
create policy "cualquiera puede actualizar items (reservar)" on items for update using (true);
create policy "el dueño de la lista borra items" on items
  for delete using (
    auth.uid() = (select user_id from lists where id = list_id)
  );

create policy "cualquiera puede leer el catálogo" on store_products for select using (true);
