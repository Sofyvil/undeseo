"use server";

import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { trackServer } from "@/lib/analytics-server";

export async function createList(formData: FormData) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login?next=/crear");
  }

  const parentsName = (formData.get("parentsName") as string) || "Nuestro festejo";
  const acceptedTerms = formData.get("acceptedTerms") === "on";
  const eventType = (formData.get("eventType") as string) || "baby_shower";
  const eventDate = (formData.get("eventDate") as string) || null;
  const eventTime = (formData.get("eventTime") as string) || null;
  const eventLocation = (formData.get("eventLocation") as string) || null;

  if (!acceptedTerms) {
    throw new Error("Hay que aceptar los Términos y Condiciones");
  }

  const { data, error } = await supabase
    .from("lists")
    .insert({
      user_id: user.id,
      owner_email: user.email,
      parents_name: parentsName,
      event_type: eventType,
      event_date: eventDate,
      event_time: eventTime,
      event_location: eventLocation,
    })
    .select("id")
    .single();

  if (error || !data) {
    // TODO: mostrar un mensaje de error prolijo en vez de romper
    throw new Error(error?.message ?? "No se pudo crear la lista");
  }

  await trackServer(user.email ?? user.id, "lista_creada", {
    eventType,
    listId: data.id,
  });

  redirect(`/l/${data.id}`);
}
