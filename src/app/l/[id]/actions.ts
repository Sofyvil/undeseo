"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { extractMLItemId, fetchMLItem } from "@/lib/mercadolibre";
import { trackServer } from "@/lib/analytics-server";

export async function updateEventDetails(
  listId: string,
  formData: FormData
) {
  const supabase = await createClient();

  await supabase
    .from("lists")
    .update({
      event_date: (formData.get("eventDate") as string) || null,
      event_time: (formData.get("eventTime") as string) || null,
      event_location: (formData.get("eventLocation") as string) || null,
    })
    .eq("id", listId);

  revalidatePath(`/l/${listId}`);
}

export async function setFlyerImage(listId: string, url: string | null) {
  const supabase = await createClient();
  await supabase.from("lists").update({ flyer_image_url: url }).eq("id", listId);
  revalidatePath(`/l/${listId}`);
}

export async function updateItem(
  listId: string,
  itemId: string,
  formData: FormData
) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Solo el dueño de la lista puede editar sus regalos.
  const { data: list } = await supabase
    .from("lists")
    .select("user_id")
    .eq("id", listId)
    .single();

  if (!user || !list || user.id !== list.user_id) return;

  const name = formData.get("name") as string;
  const priceRaw = formData.get("price") as string;
  const price = priceRaw ? Number(priceRaw) : null;
  const details = (formData.get("details") as string) || null;
  const productUrl = (formData.get("productUrl") as string) || null;
  const imageUrl = (formData.get("imageUrl") as string) || null;

  if (!name) return;

  await supabase
    .from("items")
    .update({
      name,
      price,
      details,
      product_url: productUrl,
      image_url: imageUrl,
    })
    .eq("id", itemId);

  revalidatePath(`/l/${listId}`);
}

export async function addItem(
  listId: string,
  data: {
    name: string;
    price: number | null;
    details: string | null;
    productUrl: string | null;
    imageUrl: string | null;
    source: "link" | "catalog";
    // Estos dos son solo para la métrica de abajo — no se guardan en la
    // tabla items, la tabla no tiene esas columnas.
    brandName?: string;
    category?: string;
  }
) {
  const supabase = await createClient();

  if (!data.name) return;

  await supabase.from("items").insert({
    list_id: listId,
    name: data.name,
    price: data.price,
    details: data.details,
    product_url: data.productUrl,
    image_url: data.imageUrl,
    source: data.source,
  });

  await trackServer(listId, "producto_agregado", {
    listId,
    source: data.source,
    name: data.name,
    price: data.price,
    brand: data.brandName ?? null,
    category: data.category ?? null,
  });

  revalidatePath(`/l/${listId}`);
}

// --- Auto-completado al pegar un link ---
//
// IMPORTANTE — no cambiar el orden de esto sin motivo:
// La lectura DIRECTA (scrapeDirectly, más abajo) es el método PRINCIPAL
// y más confiable para traer el precio, sobre todo en tiendas argentinas
// tipo Cheeky que exponen `og:price:amount` en el HTML. La consulta a la
// API de Microlink queda solo como respaldo (por ejemplo, si un sitio
// bloquea la lectura directa). Esto ya se probó y funciona — si en algún
// momento el precio "deja de andar" de nuevo, revisar PRIMERO que
// scrapeDirectly() siga siendo el primer intento antes de tocar nada más.

function mqlValue(v: unknown): string | null {
  if (v === null || v === undefined) return null;
  if (typeof v === "string") return v;
  if (typeof v === "object" && v !== null && "value" in v) {
    return (v as { value: string }).value;
  }
  return null;
}

function parsePriceString(raw: string | null): number | null {
  if (!raw) return null;
  let s = String(raw).replace(/[^0-9.,]/g, "").trim();
  if (!s) return null;
  const lastDot = s.lastIndexOf(".");
  const lastComma = s.lastIndexOf(",");
  if (lastDot > -1 && lastComma > -1) {
    if (lastComma > lastDot) s = s.replace(/\./g, "").replace(",", ".");
    else s = s.replace(/,/g, "");
  } else if (lastComma > -1) {
    const decimals = s.length - lastComma - 1;
    s = decimals <= 2 ? s.replace(",", ".") : s.replace(/,/g, "");
  } else if (lastDot > -1) {
    const decimals = s.length - lastDot - 1;
    if (decimals !== 1 && decimals !== 2) s = s.replace(/\./g, "");
  }
  const n = parseFloat(s);
  return isNaN(n) ? null : n;
}

function findPriceInJsonLd(rawStrings: string[]): string | number | null {
  let found: string | number | null = null;
  function walk(obj: unknown) {
    if (found !== null) return;
    if (Array.isArray(obj)) {
      obj.forEach(walk);
      return;
    }
    if (obj && typeof obj === "object") {
      const o = obj as Record<string, unknown>;
      const type = o["@type"];
      const isProduct = type === "Product" || (Array.isArray(type) && type.includes("Product"));
      if (isProduct && o.offers) {
        const offers = Array.isArray(o.offers) ? o.offers : [o.offers];
        for (const off of offers) {
          const offer = off as Record<string, unknown>;
          if (offer?.price) {
            found = offer.price as string | number;
            return;
          }
          const priceSpec = offer?.priceSpecification as Record<string, unknown> | undefined;
          if (priceSpec?.price) {
            found = priceSpec.price as string | number;
            return;
          }
        }
      }
      if (o["@graph"]) walk(o["@graph"]);
      Object.values(o).forEach((v) => {
        if (found === null && typeof v === "object") walk(v);
      });
    }
  }
  rawStrings.forEach((s) => {
    try {
      walk(JSON.parse(s));
    } catch {
      // no era JSON válido, seguimos
    }
  });
  return found;
}

function extractMetaMap(html: string): Record<string, string> {
  const map: Record<string, string> = {};
  const metaTags = html.match(/<meta\b[^>]*>/gi) || [];
  for (const tag of metaTags) {
    const propMatch = tag.match(/(?:property|name)\s*=\s*["']([^"']+)["']/i);
    const contentMatch = tag.match(/content\s*=\s*["']([^"']*)["']/i);
    if (propMatch && contentMatch) {
      map[propMatch[1].toLowerCase()] = contentMatch[1];
    }
  }
  return map;
}

function extractJsonLdBlocks(html: string): string[] {
  const blocks: string[] = [];
  const re = /<script[^>]+type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi;
  let m;
  while ((m = re.exec(html)) !== null) {
    blocks.push(m[1]);
  }
  return blocks;
}

// Lee la página nosotros mismos (desde el servidor) en vez de depender
// pura y exclusivamente de la API externa — más confiable para precio.
async function scrapeDirectly(url: string): Promise<{ name: string | null; image: string | null; price: number | null }> {
  const res = await fetch(url, {
    headers: {
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36",
    },
  });
  const html = await res.text();

  const metaMap = extractMetaMap(html);
  const jsonldBlocks = extractJsonLdBlocks(html);

  let price = parsePriceString(String(findPriceInJsonLd(jsonldBlocks) ?? ""));
  if (!price) {
    const metaPrice =
      metaMap["product:price:amount"] ||
      metaMap["og:price:amount"] ||
      metaMap["twitter:data1"] ||
      null;
    price = parsePriceString(metaPrice);
  }

  const name = metaMap["og:title"] || null;
  const image = metaMap["og:image"] || null;

  return { name, image, price };
}

export type LinkPreview = {
  name: string;
  image: string | null;
  price: number | null;
  url: string;
  error?: string;
};

export async function fetchLinkPreview(rawUrl: string): Promise<LinkPreview> {
  const url = rawUrl.startsWith("http") ? rawUrl : `https://${rawUrl}`;

  // Mercado Libre: vía oficial primero, siempre — nunca intentar
  // scrapear su HTML (nos bloquean y devuelven el logo genérico).
  const mlItemId = extractMLItemId(url);
  if (mlItemId) {
    const mlItem = await fetchMLItem(mlItemId);
    if (mlItem) {
      return { name: mlItem.name, image: mlItem.image, price: mlItem.price, url };
    }
    // Si la conexión con ML no está lista o falló, seguimos con el resto
    // como respaldo — probablemente no traiga precio, pero no rompemos nada.
  }

  // 1er intento: lectura directa nuestra (más confiable para precio)
  let direct: { name: string | null; image: string | null; price: number | null } | null = null;
  try {
    direct = await scrapeDirectly(url);
  } catch {
    direct = null;
  }

  if (direct && (direct.name || direct.price)) {
    if (direct.name && direct.price) {
      return { name: direct.name, image: direct.image, price: direct.price, url };
    }
    // Nos faltó algo (ej. precio no encontrado) — completamos con Microlink abajo
  }

  const params = new URLSearchParams({ url, meta: "true" });
  params.set("data.jsonld.selectorAll", 'script[type="application/ld+json"]');
  params.set("data.jsonld.attr", "text");

  const priceRules: [string, string][] = [
    ['meta[property="product:price:amount"]', "content"],
    ['meta[property="og:price:amount"]', "content"],
    ['meta[itemprop="price"]', "content"],
    ['[itemprop="price"]', "text"],
    ['meta[name="twitter:data1"]', "content"],
    ["[data-price]", "data-price"],
    [".price-item--regular", "text"],
    [".product-price", "text"],
    [".precio", "text"],
    [".price", "text"],
  ];
  priceRules.forEach((rule, i) => {
    params.set(`data.price${i}.selector`, rule[0]);
    params.set(`data.price${i}.attr`, rule[1]);
  });

  try {
    const res = await fetch("https://api.microlink.io/?" + params.toString());
    const json = await res.json();

    if (json.status !== "success") {
      return { name: "", image: null, price: null, url, error: "No pudimos leer la página automáticamente. Completá los datos a mano." };
    }

    const d = json.data;
    let price: number | null = null;

    const jsonldRaw = d.jsonld;
    const jsonldArr: string[] = Array.isArray(jsonldRaw)
      ? (jsonldRaw.map(mqlValue).filter(Boolean) as string[])
      : mqlValue(jsonldRaw)
        ? [mqlValue(jsonldRaw) as string]
        : [];
    price = parsePriceString(String(findPriceInJsonLd(jsonldArr) ?? ""));

    if (!price) {
      for (let i = 0; i < priceRules.length; i++) {
        const candidate = parsePriceString(mqlValue(d[`price${i}`]));
        if (candidate) {
          price = candidate;
          break;
        }
      }
    }

    return {
      name: direct?.name || d.title || "",
      image: direct?.image || d.image?.url || d.logo?.url || null,
      price: direct?.price ?? price,
      url,
    };
  } catch {
    // Si Microlink falla pero ya teníamos algo de la lectura directa, lo usamos igual
    if (direct && (direct.name || direct.price)) {
      return { name: direct.name || "", image: direct.image, price: direct.price, url };
    }
    return { name: "", image: null, price: null, url, error: "No pudimos leer la página automáticamente. Completá los datos a mano." };
  }
}

export async function reserveItem(
  listId: string,
  itemId: string,
  guestName: string
) {
  const supabase = await createClient();

  await supabase
    .from("items")
    .update({
      reserved: true,
      reserved_by: guestName || "Un invitado",
      reserved_at: new Date().toISOString(),
      confirmed: false,
    })
    .eq("id", itemId);

  await trackServer(guestName || "invitado_anonimo", "invitado_reservo", {
    listId,
    itemId,
  });

  revalidatePath(`/l/${listId}`);
}

export async function unreserveItem(listId: string, itemId: string) {
  const supabase = await createClient();

  await supabase
    .from("items")
    .update({
      reserved: false,
      reserved_by: null,
      reserved_at: null,
      confirmed: false,
    })
    .eq("id", itemId);

  revalidatePath(`/l/${listId}`);
}

export async function deleteItem(listId: string, itemId: string) {
  const supabase = await createClient();
  await supabase.from("items").delete().eq("id", itemId);
  revalidatePath(`/l/${listId}`);
}
