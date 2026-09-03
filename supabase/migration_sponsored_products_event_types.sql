-- Migración: permitir varias categorías por producto patrocinado
-- Cómo usar: Supabase > tu proyecto > SQL Editor > pegar todo esto > Run

alter table sponsored_products add column event_types text[] default '{}';
