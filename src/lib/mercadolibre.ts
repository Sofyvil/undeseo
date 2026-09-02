import { createAdminClient } from "@/lib/supabase/admin";

const ML_TOKEN_URL = "https://api.mercadolibre.com/oauth/token";

type MLTokenResponse = {
  access_token: string;
  refresh_token: string;
  expires_in: number;
};

async function saveTokens(tokens: MLTokenResponse) {
  const supabase = createAdminClient();
  const expiresAt = new Date(Date.now() + tokens.expires_in * 1000).toISOString();

  await supabase.from("ml_credentials").upsert({
    id: 1,
    access_token: tokens.access_token,
    refresh_token: tokens.refresh_token,
    expires_at: expiresAt,
    updated_at: new Date().toISOString(),
  });
}

export async function exchangeCodeForTokens(code: string, redirectUri: string) {
  const res = await fetch(ML_TOKEN_URL, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "authorization_code",
      client_id: process.env.ML_CLIENT_ID!,
      client_secret: process.env.ML_CLIENT_SECRET!,
      code,
      redirect_uri: redirectUri,
    }),
  });
  const data = await res.json();
  if (!res.ok || !data.access_token) {
    throw new Error(data.message || "No se pudo conectar con Mercado Libre");
  }
  await saveTokens(data);
}

async function refreshAccessToken(refreshToken: string) {
  const res = await fetch(ML_TOKEN_URL, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "refresh_token",
      client_id: process.env.ML_CLIENT_ID!,
      client_secret: process.env.ML_CLIENT_SECRET!,
      refresh_token: refreshToken,
    }),
  });
  const data = await res.json();
  if (!res.ok || !data.access_token) {
    throw new Error("No se pudo renovar la conexión con Mercado Libre");
  }
  await saveTokens(data);
  return data.access_token as string;
}

// Devuelve un access_token válido, renovándolo solo si hace falta.
// Devuelve null si todavía no se conectó nunca (falta el paso manual).
export async function getValidMLAccessToken(): Promise<string | null> {
  const supabase = createAdminClient();
  const { data: row, error: dbError } = await supabase
    .from("ml_credentials")
    .select("*")
    .eq("id", 1)
    .maybeSingle();

  if (dbError) {
    console.error("[ML] Error leyendo ml_credentials:", dbError);
    return null;
  }

  if (!row || !row.refresh_token) {
    console.error("[ML] No hay credenciales guardadas todavía (row vacía o sin refresh_token)");
    return null;
  }

  const expiresAt = row.expires_at ? new Date(row.expires_at).getTime() : 0;
  const isExpiringSoon = expiresAt - Date.now() < 5 * 60 * 1000; // margen de 5 min

  if (!isExpiringSoon && row.access_token) {
    return row.access_token as string;
  }

  try {
    console.error("[ML] Renovando token (isExpiringSoon o sin access_token)");
    return await refreshAccessToken(row.refresh_token);
  } catch (e) {
    console.error("[ML] Error renovando token:", e);
    return null;
  }
}

// Extrae el ID de un producto (ej. "MLA1118958953") de una URL de Mercado Libre.
// Prioridad: primero el ítem real de la publicación (wid / item_id en la URL,
// que es el que efectivamente se compra), y solo si no aparece, el ID
// genérico de la ficha de producto (/p/MLA...).
export function extractMLItemId(url: string): string | null {
  let decoded = url;
  try {
    decoded = decodeURIComponent(url);
  } catch {
    // si falla el decode, seguimos con la url tal cual
  }

  const priorityPatterns = [/wid=(ML[ABC]\d+)/i, /item_id[:=](ML[ABC]\d+)/i];
  for (const re of priorityPatterns) {
    const m = decoded.match(re);
    if (m) return m[1].toUpperCase();
  }

  const generalMatch = decoded.match(/ML[ABC]-?(\d+)/i);
  if (!generalMatch) return null;
  const siteCode = generalMatch[0].slice(0, 3).toUpperCase();
  return `${siteCode}${generalMatch[1]}`;
}

export type MLItemPreview = {
  name: string;
  price: number | null;
  image: string | null;
};

export async function fetchMLItem(itemId: string): Promise<MLItemPreview | null> {
  const token = await getValidMLAccessToken();
  if (!token) {
    console.error("[ML] fetchMLItem: no hay token válido, aborto");
    return null;
  }

  const res = await fetch(`https://api.mercadolibre.com/items/${itemId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) {
    const body = await res.text();
    console.error(`[ML] fetchMLItem: la API respondió ${res.status} para ${itemId}:`, body);
    return null;
  }

  const data = await res.json();
  return {
    name: data.title || "",
    price: typeof data.price === "number" ? data.price : null,
    image: data.pictures?.[0]?.secure_url || data.pictures?.[0]?.url || data.thumbnail || null,
  };
}
