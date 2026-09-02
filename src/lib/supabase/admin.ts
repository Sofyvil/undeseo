import { createClient as createSupabaseClient } from "@supabase/supabase-js";

// OJO: este cliente usa la "service role key" — tiene permiso para saltearse
// todas las reglas de seguridad (RLS). Nunca importar este archivo desde un
// componente de cliente ni exponer esta clave al navegador. Solo se usa acá
// para leer/escribir la tabla ml_credentials, que no tiene políticas públicas
// a propósito.
export function createAdminClient() {
  return createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}
