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

// Si viene un archivo de imagen en el form, lo sube al bucket
// "sponsored-products" y devuelve la URL pública. Si no viene archivo,
// devuelve null (y el que llama decide si usar el link pegado a mano).
async function maybeUploadImage(formData: FormData, admin: ReturnType<typeof createAdminClient>) {
  const file = formData.get("imageFile") as File | null;
  if (!file || file.size === 0) return null;

  const ext = file.name.split(".").pop() || "jpg";
  const path = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

  const { error } = await admin.storage
    .from("sponsored-products")
    .upload(path, file, { contentType: file.type || "image/jpeg" });

  if (error) return null;

  const { data } = admin.storage.from("sponsored-products").getPublicUrl(path);
  return data.publicUrl;
}

export async function addSponsoredProduct(formData: FormData) {
  await assertIsAdmin();
  const admin = createAdminClient();

  const brandName = formData.get("brandName") as string;
  const productName = formData.get("productName") as string;
  const priceRaw = formData.get("price") as string;
  const price = priceRaw ? Number(priceRaw) : null;
  const details = (formData.get("details") as string) || null;
  const productUrl = formData.get("productUrl") as string;
  const eventType = (formData.get("eventType") as string) || null;

  if (!brandName || !productName || !productUrl) return;

  const uploadedUrl = await maybeUploadImage(formData, admin);
  const pastedUrl = (formData.get("imageUrl") as string) || null;
  const imageUrl = uploadedUrl || pastedUrl;

  await admin.from("sponsored_products").insert({
    brand_name: brandName,
    product_name: productName,
    price,
    details,
    image_url: imageUrl,
    product_url: productUrl,
    event_type: eventType || null,
    active: true,
  });

  revalidatePath("/admin/patrocinados");
}

export async function editSponsoredProduct(id: string, formData: FormData) {
  await assertIsAdmin();
  const admin = createAdminClient();

  const brandName = formData.get("brandName") as string;
  const productName = formData.get("productName") as string;
  const priceRaw = formData.get("price") as string;
  const price = priceRaw ? Number(priceRaw) : null;
  const details = (formData.get("details") as string) || null;
  const productUrl = formData.get("productUrl") as string;
  const eventType = (formData.get("eventType") as string) || null;

  if (!brandName || !productName || !productUrl) return;

  const uploadedUrl = await maybeUploadImage(formData, admin);
  const pastedUrl = (formData.get("imageUrl") as string) || null;
  // Si subió un archivo nuevo, ese manda. Si no, pero cambió el link a
  // mano, se respeta ese. Si dejó todo igual, no tocamos la imagen.
  const imageUrl = uploadedUrl || pastedUrl;

  await admin
    .from("sponsored_products")
    .update({
      brand_name: brandName,
      product_name: productName,
      price,
      details,
      ...(imageUrl ? { image_url: imageUrl } : {}),
      product_url: productUrl,
      event_type: eventType || null,
    })
    .eq("id", id);

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
