"use client";

import { useState } from "react";
import { track } from "@/lib/analytics";

export function CopyLinkButton({
  link,
  eventName,
}: {
  link: string;
  eventName: string;
}) {
  const [copied, setCopied] = useState(false);

  const message = `¡Armamos una lista de regalos para ${eventName}! 🎁

Ahí les dejamos algunas ideas de lo que nos gustaría recibir. Pueden elegir lo que quieran, acceder directo a la tienda donde se compra, y no hace falta registrarse.

Eso sí: no se olviden de marcarlo como reservado para que no se repita con otro invitado 😊

${link}`;

  return (
    <button
      type="button"
      onClick={() => {
        navigator.clipboard?.writeText(message).then(() => {
          setCopied(true);
          track("lista_compartida", { link });
          setTimeout(() => setCopied(false), 1800);
        });
      }}
      className="shrink-0 bg-white/15 hover:bg-white/25 transition-colors text-white text-[0.78rem] font-semibold px-3.5 py-2 rounded-full"
    >
      {copied ? "¡Copiado! ✓" : "Copiar"}
    </button>
  );
}
