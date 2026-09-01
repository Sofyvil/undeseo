"use client";

import { useState, useTransition } from "react";
import { Icon } from "@/components/Icon";
import { fetchLinkPreview, addItem, type LinkPreview } from "./actions";

export function AddItemForm({ listId }: { listId: string }) {
  const [linkInput, setLinkInput] = useState("");
  const [preview, setPreview] = useState<LinkPreview | null>(null);
  const [manualMode, setManualMode] = useState(false);
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [isFetching, startFetching] = useTransition();
  const [isSaving, startSaving] = useTransition();

  function handleFetch() {
    if (!linkInput.trim()) return;
    startFetching(async () => {
      const result = await fetchLinkPreview(linkInput.trim());
      setPreview(result);
      setName(result.name);
      setPrice(result.price ? String(result.price) : "");
    });
  }

  function handleAdd() {
    if (!name.trim()) return;
    startSaving(async () => {
      await addItem(listId, {
        name: name.trim(),
        price: price ? Number(price) : null,
        productUrl: preview?.url || null,
        imageUrl: preview?.image || null,
        source: "link",
      });
      // reset
      setLinkInput("");
      setPreview(null);
      setManualMode(false);
      setName("");
      setPrice("");
    });
  }

  return (
    <div className="bg-white rounded-[20px] border border-line p-4.5 mb-5">
      <p className="font-display font-semibold text-[1.05rem] mb-3">
        Agregar un regalo
      </p>

      {!manualMode ? (
        <>
          <div className="flex gap-2">
            <input
              value={linkInput}
              onChange={(e) => setLinkInput(e.target.value)}
              placeholder="Pegá el link del producto…"
              className="flex-1 px-3.5 py-2.5 rounded-xl border border-line outline-none focus:border-sage text-[0.9rem]"
            />
            <button
              type="button"
              onClick={handleFetch}
              disabled={isFetching || !linkInput.trim()}
              className="px-4 py-2.5 rounded-xl bg-sage text-white font-semibold text-[0.85rem] hover:bg-sage-dark transition-colors disabled:opacity-50 shrink-0"
            >
              {isFetching ? "Buscando…" : "Buscar"}
            </button>
          </div>

          <button
            type="button"
            onClick={() => setManualMode(true)}
            className="text-[0.75rem] text-ink-soft underline mt-2"
          >
            Prefiero cargarlo a mano (sin link)
          </button>

          {preview?.error && (
            <p className="text-[0.78rem] text-rose-dark mt-2">{preview.error}</p>
          )}
        </>
      ) : (
        <button
          type="button"
          onClick={() => {
            setManualMode(false);
            setPreview(null);
            setName("");
            setPrice("");
          }}
          className="text-[0.75rem] text-ink-soft underline mb-2"
        >
          ← Prefiero pegar un link
        </button>
      )}

      {(preview || manualMode) && (
        <div className="mt-3 pt-3 border-t border-line flex gap-3">
          {!manualMode && (
            <div className="w-16 h-16 shrink-0 rounded-xl bg-cream-2 flex items-center justify-center overflow-hidden">
              {preview?.image ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={preview.image}
                  alt=""
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
              ) : (
                <Icon name="gift" className="w-7 h-7 text-sage-dark" />
              )}
            </div>
          )}
          <div className="flex-1 flex flex-col gap-2">
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Nombre del producto"
              className="px-3 py-2 rounded-lg border border-line outline-none focus:border-sage text-[0.85rem]"
            />
            <input
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              type="number"
              placeholder="Precio (opcional)"
              className="px-3 py-2 rounded-lg border border-line outline-none focus:border-sage text-[0.85rem]"
            />
            <button
              type="button"
              onClick={handleAdd}
              disabled={isSaving || !name.trim()}
              className="py-2.5 rounded-full bg-sage text-white font-semibold text-[0.85rem] hover:bg-sage-dark transition-colors disabled:opacity-50"
            >
              {isSaving ? "Agregando…" : "Agregar a la lista"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
