import { createBrowserClient } from "@supabase/ssr";

// Este archivo crea la conexión a la base de datos para usar
// desde el navegador (por ejemplo, cuando un invitado reserva un regalo).
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
