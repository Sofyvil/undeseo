"use server";

import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export async function createList(formData: FormData) {
  const supabase = await createClient();

  const parentsName = (formData.get("parentsName") as string) || "Nuestro festejo";
  const ownerEmail = (formData.get("ownerEmail") as string || "").trim().toLowerCase();
  const acceptedTerms = formData.get("acceptedTerms") === "on";
  const eventType = (formData.get("eventType") as string) || "baby_shower";
  const eventDate = (formData.get("eventDate") as string) || null;
  const eventTime = (formData.get("eventTime") as string) || null;
  const eventLocation = (formData.get("eventLocation") as string) || null;

  if (!ownerEmail) {
    throw new Error("Falta el mail del organizador");
  }
  if (!acceptedTerms) {
    throw new Error("Hay que aceptar los Términos y Condiciones");
  }

  const { data, error } = await supabase
    .from("lists")
    .insert({
      parents_name: parentsName,
      owner_email: ownerEmail,
      event_type: eventType,
      event_date: eventDate,
      event_time: eventTime,
      event_location: eventLocation,
    })
    .select("id, owner_token")
    .single();

  if (error || !data) {
    // TODO: mostrar un mensaje de error prolijo en vez de romper
    throw new Error(error?.message ?? "No se pudo crear la lista");
  }

  redirect(`/l/${data.id}?owner=${data.owner_token}`);
}
