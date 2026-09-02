"use server";

import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { revalidatePath } from "next/cache";

// Chequeo de seguridad: solo el mail configurado en ADMIN_EMAIL puede
// ejecutar estas acciones, sin importar qué mande el formulario.
async function assertIsAdmin() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user?.email || user.email !== process.env.ADMIN_EMAIL) {
    throw new Error("No autorizado");
  }
}

export async function addSponsoredProduct(formData: FormData) {
  await assertIsAdmin();
  const admin = createAdminClient();

  const brandName = formData.get("brandName") as string;
  const productName = formData.get("productName") as string;
  const imageUrl = (formData.get("imageUrl") as string) || null;
  const productUrl = formData.get("productUrl") as string;
  const eventType = (formData.get("eventType") as string) || null;

  if (!brandName || !productName || !productUrl) return;

  await admin.from("sponsored_products").insert({
    brand_name: brandName,
    product_name: productName,
    image_url: imageUrl,
    product_url: productUrl,
    event_type: eventType || null,
    active: true,
  });

  revalidatePath("/admin/patrocinados");
}

export async function toggleSponsoredProduct(id: string, active: boolean) {
  await assertIsAdmin();
  const admin = createAdminClient();
  await admin.from("sponsored_products").update({ active }).eq("id", id);
  revalidatePath("/admin/patrocinados");
}

export async function deleteSponsoredProduct(id: string) {
  await assertIsAdmin();
  const admin = createAdminClient();
  await admin.from("sponsored_products").delete().eq("id", id);
  revalidatePath("/admin/patrocinados");
}
