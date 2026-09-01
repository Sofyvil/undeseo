"use client";

import { useState, useTransition } from "react";
import { createClient } from "@/lib/supabase/client";
import { setFlyerImage } from "./actions";

function resizeImageFile(file: File, maxWidth = 1000, quality = 0.78): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const scale = Math.min(1, maxWidth / img.width);
        const w = Math.round(img.width * scale);
        const h = Math.round(img.height * scale);
        const canvas = document.createElement("canvas");
        canvas.width = w;
        canvas.height = h;
        canvas.getContext("2d")?.drawImage(img, 0, 0, w, h);
        canvas.toBlob(
          (blob) => (blob ? resolve(blob) : reject(new Error("No se pudo procesar la imagen"))),
          "image/jpeg",
          quality
        );
      };
      img.onerror = reject;
      img.src = e.target?.result as string;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export function FlyerUploader({
  listId,
  currentUrl,
}: {
  listId: string;
  currentUrl: string | null;
}) {
  const [preview, setPreview] = useState<string | null>(currentUrl);
  const [error, setError] = useState<string | null>(null);
  const [isUploading, startUploading] = useTransition();

  function handleFile(file: File) {
    setError(null);
    startUploading(async () => {
      try {
        const resized = await resizeImageFile(file);
        const supabase = createClient();
        const path = `${listId}-${Date.now()}.jpg`;

        const { error: uploadError } = await supabase.storage
          .from("flyers")
          .upload(path, resized, { contentType: "image/jpeg", upsert: true });

        if (uploadError) throw uploadError;

        const { data: publicUrlData } = supabase.storage
          .from("flyers")
          .getPublicUrl(path);

        await setFlyerImage(listId, publicUrlData.publicUrl);
        setPreview(publicUrlData.publicUrl);
      } catch {
        setError("No pudimos subir la imagen. Probá de nuevo.");
      }
    });
  }

  function handleRemove() {
    startUploading(async () => {
      await setFlyerImage(listId, null);
      setPreview(null);
    });
  }

  return (
    <div>
      {preview ? (
        <div>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={preview}
            alt="Flyer del evento"
            className="w-full rounded-xl mb-2 max-h-52 object-cover"
          />
          <button
            type="button"
            onClick={handleRemove}
            disabled={isUploading}
            className="text-[0.75rem] text-ink-soft underline"
          >
            {isUploading ? "Quitando…" : "Quitar imagen"}
          </button>
        </div>
      ) : (
        <label className="flex flex-col items-center justify-center gap-1.5 border-2 border-dashed border-line rounded-xl py-6 px-3 cursor-pointer hover:border-sage transition-colors text-center">
          <span className="text-[0.82rem] font-semibold text-ink-soft">
            {isUploading ? "Subiendo…" : "Subí tu invitación"}
          </span>
          <span className="text-[0.72rem] text-ink-soft/70">
            Foto, captura o diseño — JPG o PNG
          </span>
          <input
            type="file"
            accept="image/*"
            className="hidden"
            disabled={isUploading}
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) handleFile(file);
            }}
          />
        </label>
      )}
      {error && <p className="text-[0.75rem] text-rose-dark mt-2">{error}</p>}
    </div>
  );
}
