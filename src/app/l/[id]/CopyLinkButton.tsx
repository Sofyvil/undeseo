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
    <div className="flex items-center gap-2 shrink-0">
      <a
        href={`https://wa.me/?text=${encodeURIComponent(message)}`}
        target="_blank"
        rel="noopener noreferrer"
        onClick={() => track("lista_compartida", { link, via: "whatsapp" })}
        className="flex items-center gap-1.5 bg-[#25D366] hover:bg-[#20bd5a] transition-colors text-white text-[0.78rem] font-semibold px-3.5 py-2 rounded-full"
      >
        <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 fill-current">
          <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.39 1.26 4.81L2 22l5.42-1.36a9.85 9.85 0 0 0 4.62 1.17h.01c5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.13-2.9-7A9.82 9.82 0 0 0 12.04 2Zm5.78 14.15c-.24.68-1.4 1.3-1.93 1.35-.5.06-1.06.08-1.71-.11-.4-.12-.9-.28-1.55-.55-2.73-1.18-4.51-3.93-4.65-4.11-.14-.18-1.11-1.47-1.11-2.81 0-1.33.7-1.99.94-2.26.24-.27.53-.34.71-.34s.36 0 .51.01c.17.01.38-.06.6.45.24.55.8 1.9.87 2.03.07.14.11.3.02.48-.09.18-.14.29-.27.44-.14.16-.29.36-.41.48-.14.14-.28.29-.12.57.16.28.71 1.17 1.53 1.9 1.05.94 1.94 1.23 2.22 1.37.28.14.44.12.61-.07.16-.19.7-.82.89-1.1.19-.28.37-.23.62-.14.25.1 1.61.76 1.89.9.28.14.46.21.53.33.07.12.07.68-.17 1.35Z" />
        </svg>
        WhatsApp
      </a>
      <button
        type="button"
        onClick={() => {
          navigator.clipboard?.writeText(message).then(() => {
            setCopied(true);
            track("lista_compartida", { link, via: "copiar" });
            setTimeout(() => setCopied(false), 1800);
          });
        }}
        className="bg-white/15 hover:bg-white/25 transition-colors text-white text-[0.78rem] font-semibold px-3.5 py-2 rounded-full"
      >
        {copied ? "¡Copiado! ✓" : "Copiar"}
      </button>
    </div>
  );
}
