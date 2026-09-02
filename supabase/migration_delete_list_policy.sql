-- Migración: permitir borrar listas
-- Cómo usar: Supabase > tu proyecto > SQL Editor > pegar todo esto > Run

create policy "el dueño puede borrar su lista" on lists
  for delete using (auth.uid() = user_id);
