"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function addItem(
  listId: string,
  data: { name: string; price: number | null; productUrl: string | null; imageUrl: string | null; source: "link" | "catalog" }
) {
  const supabase = await createClient();

  if (!data.name) return;

  await supabase.from("items").insert({
    list_id: listId,
    name: data.name,
    price: data.price,
    product_url: data.productUrl,
    image_url: data.imageUrl,
    source: data.source,
  });

  revalidatePath(`/l/${listId}`);
}

// --- Auto-completado al pegar un link ---

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

export type LinkPreview = {
  name: string;
  image: string | null;
  price: number | null;
  url: string;
  error?: string;
};

export async function fetchLinkPreview(rawUrl: string): Promise<LinkPreview> {
  const url = rawUrl.startsWith("http") ? rawUrl : `https://${rawUrl}`;

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
      name: d.title || "",
      image: d.image?.url || d.logo?.url || null,
      price,
      url,
    };
  } catch {
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
