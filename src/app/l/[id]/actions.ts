"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

// NOTA: esta es la versión simple (Semana 1) — agregar un regalo a mano.
// El auto-completado de foto/precio pegando un link (como en el prototipo)
// se conecta en la Semana 2, cuando sumemos el scraping server-side y
// la integración oficial con la API de Mercado Libre.
export async function addItemManual(listId: string, formData: FormData) {
  const supabase = await createClient();

  const name = formData.get("name") as string;
  const priceRaw = formData.get("price") as string;
  const productUrl = (formData.get("productUrl") as string) || null;

  if (!name) return;

  await supabase.from("items").insert({
    list_id: listId,
    name,
    price: priceRaw ? Number(priceRaw) : null,
    product_url: productUrl,
    source: "link",
  });

  revalidatePath(`/l/${listId}`);
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
