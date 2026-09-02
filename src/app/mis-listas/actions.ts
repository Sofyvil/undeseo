"use server";

import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/login");
}

export async function deleteList(listId: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return;

  // El .eq("user_id", ...) es un segundo seguro además de la política de
  // Supabase: aunque alguien mande un id ajeno, esto no borra nada que no
  // sea suyo.
  await supabase.from("lists").delete().eq("id", listId).eq("user_id", user.id);

  revalidatePath("/mis-listas");
}
