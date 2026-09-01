"use client";

import { useState } from "react";

export function CopyLinkButton({ link }: { link: string }) {
  const [copied, setCopied] = useState(false);

  return (
    <button
      type="button"
      onClick={() => {
        navigator.clipboard?.writeText(link).then(() => {
          setCopied(true);
          setTimeout(() => setCopied(false), 1800);
        });
      }}
      className="shrink-0 bg-white/15 hover:bg-white/25 transition-colors text-white text-[0.78rem] font-semibold px-3.5 py-2 rounded-full"
    >
      {copied ? "¡Copiado! ✓" : "Copiar"}
    </button>
  );
}
