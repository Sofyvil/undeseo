-- Migración: agregar detalle/descripción a productos patrocinados
-- Cómo usar: Supabase > tu proyecto > SQL Editor > pegar todo esto > Run

alter table sponsored_products add column details text;
