"use server";

import { createClient } from "@/lib/supabase/server";
import { getResend, FROM_EMAIL } from "@/lib/resend";

const EVENT_LABELS: Record<string, string> = {
  baby_shower: "Baby shower",
  nacimiento: "Nacimiento",
  cumple: "Cumpleaños",
  otro: "Otro evento",
};

export async function recoverAccess(
  formData: FormData
): Promise<{ ok: boolean; message: string }> {
  const email = ((formData.get("email") as string) || "").trim().toLowerCase();

  if (!email) {
    return { ok: false, message: "Ingresá un mail." };
  }

  const supabase = await createClient();
  const { data: lists } = await supabase
    .from("lists")
    .select("id, owner_token, parents_name, event_type, created_at")
    .eq("owner_email", email)
    .order("created_at", { ascending: false });

  // Importante: siempre devolvemos el mismo mensaje, tenga o no listas ese
  // mail. Así nadie puede usar este formulario para "adivinar" qué mails
  // tienen listas creadas.
  const genericMessage =
    "Si ese mail tiene listas creadas, en unos minutos te va a llegar un correo con los links de acceso.";

  if (!lists || lists.length === 0) {
    return { ok: true, message: genericMessage };
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "";
  const itemsHtml = lists
    .map((l) => {
      const label = EVENT_LABELS[l.event_type] ?? "Evento";
      const link = `${siteUrl}/l/${l.id}?owner=${l.owner_token}`;
      return `<li style="margin-bottom:12px;">
        <strong>${l.parents_name}</strong> — ${label}<br/>
        <a href="${link}">${link}</a>
      </li>`;
    })
    .join("");

  try {
    const resend = getResend();
    await resend.emails.send({
      from: FROM_EMAIL,
      to: email,
      subject: "El acceso a tu lista de Un Deseo",
      html: `
        <div style="font-family: sans-serif; color: #3A3A38;">
          <p>¡Hola! Encontramos ${lists.length > 1 ? "estas listas" : "esta lista"} asociada a tu mail:</p>
          <ul style="padding-left: 18px;">${itemsHtml}</ul>
          <p style="color: #7A776E; font-size: 13px;">Guardá este link, es tu acceso de organizador/a. No lo compartas — el que compartís con tus invitados es otro.</p>
          <p style="color: #7A776E; font-size: 13px;">Un Deseo 💛</p>
        </div>
      `,
    });
  } catch (e) {
    console.error("Error enviando mail de recuperación", e);
    return {
      ok: false,
      message: "Tuvimos un problema enviando el mail. Intentá de nuevo en un rato.",
    };
  }

  return { ok: true, message: genericMessage };
}
