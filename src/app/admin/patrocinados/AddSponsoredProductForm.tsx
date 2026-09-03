"use client";

import { useState, useTransition } from "react";
import { EVENTS } from "@/lib/events";
import { addSponsoredProduct, fetchProductPreview } from "./actions";

export function AddSponsoredProductForm() {
  const [productUrl, setProductUrl] = useState("");
  const [brandName, setBrandName] = useState("");
  const [productName, setProductName] = useState("");
  const [price, setPrice] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [isFetching, startFetching] = useTransition();
  const [isSaving, startSaving] = useTransition();
  const [fetchError, setFetchError] = useState<string | null>(null);

  function handleAutocomplete() {
    if (!productUrl.trim()) return;
    setFetchError(null);
    startFetching(async () => {
      const result = await fetchProductPreview(productUrl.trim());
      if (result.name) setProductName(result.name);
      if (result.price) setPrice(String(result.price));
      if (result.image) setImageUrl(result.image);
      if (!result.name && !result.price && !result.image) {
        setFetchError(
          "No pudimos traer los datos automáticamente. Completá el resto a mano."
        );
      }
    });
  }

  function handleSubmit(formData: FormData) {
    startSaving(async () => {
      await addSponsoredProduct(formData);
      setProductUrl("");
      setBrandName("");
      setProductName("");
      setPrice("");
      setImageUrl("");
    });
  }

  return (
    <form
      action={handleSubmit}
      className="bg-white border border-line rounded-2xl p-5 flex flex-col gap-3 mb-8"
    >
      <p className="font-display font-semibold text-[1.05rem] mb-1">
        Agregar producto
      </p>

      <div>
        <label className="text-[0.78rem] font-semibold text-ink-soft mb-1 block">
          Link del producto
        </label>
        <div className="flex gap-2">
          <input
            name="productUrl"
            required
            value={productUrl}
            onChange={(e) => setProductUrl(e.target.value)}
            placeholder="https://..."
            className="flex-1 min-w-0 px-3.5 py-2.5 rounded-xl border border-line bg-cream outline-none focus:border-sage text-[0.9rem]"
          />
          <button
            type="button"
            onClick={handleAutocomplete}
            disabled={isFetching}
            className="px-3.5 py-2.5 rounded-xl bg-sage text-white font-semibold text-[0.82rem] shrink-0 disabled:opacity-60"
          >
            {isFetching ? "Buscando…" : "Autocompletar"}
          </button>
        </div>
        <p className="text-[0.72rem] text-ink-soft/70 mt-1">
          Pegá el link y apretá &quot;Autocompletar&quot; para traer nombre, foto y
          precio automáticamente. Si algún dato no lo puede traer, completalo
          a mano abajo.
        </p>
        {fetchError && (
          <p className="text-[0.75rem] text-rose-dark mt-1">{fetchError}</p>
        )}
      </div>

      <div>
        <label className="text-[0.78rem] font-semibold text-ink-soft mb-1 block">
          Marca
        </label>
        <input
          name="brandName"
          required
          value={brandName}
          onChange={(e) => setBrandName(e.target.value)}
          placeholder="Ej: Bebesit"
          className="w-full px-3.5 py-2.5 rounded-xl border border-line bg-cream outline-none focus:border-sage text-[0.9rem]"
        />
      </div>
      <div>
        <label className="text-[0.78rem] font-semibold text-ink-soft mb-1 block">
          Nombre del producto
        </label>
        <input
          name="productName"
          required
          value={productName}
          onChange={(e) => setProductName(e.target.value)}
          placeholder="Ej: Mantita térmica orgánica"
          className="w-full px-3.5 py-2.5 rounded-xl border border-line bg-cream outline-none focus:border-sage text-[0.9rem]"
        />
      </div>
      <div>
        <label className="text-[0.78rem] font-semibold text-ink-soft mb-1 block">
          Detalle (opcional)
        </label>
        <input
          name="details"
          placeholder="Ej: Talle único, 5 colores a elección"
          className="w-full px-3.5 py-2.5 rounded-xl border border-line bg-cream outline-none focus:border-sage text-[0.9rem]"
        />
      </div>
      <div>
        <label className="text-[0.78rem] font-semibold text-ink-soft mb-1 block">
          Precio
        </label>
        <input
          name="price"
          type="number"
          step="0.01"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          placeholder="Ej: 28500"
          className="w-full px-3.5 py-2.5 rounded-xl border border-line bg-cream outline-none focus:border-sage text-[0.9rem]"
        />
      </div>
      <div>
        <label className="text-[0.78rem] font-semibold text-ink-soft mb-1 block">
          Imagen
        </label>
        {imageUrl && (
          <div className="flex items-center gap-2 mb-2">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={imageUrl}
              alt=""
              className="w-12 h-12 rounded-lg object-cover bg-cream-2"
            />
            <span className="text-[0.75rem] text-ink-soft">
              Foto encontrada automáticamente
            </span>
          </div>
        )}
        <input
          name="imageFile"
          type="file"
          accept="image/*"
          className="w-full text-[0.85rem]"
        />
        <p className="text-[0.72rem] text-ink-soft/70 mt-1">
          Si preferís subir tu propia foto (por ejemplo si la tienda no dejó
          traer la imagen), elegí un archivo acá — esto tiene prioridad sobre
          la foto automática.
        </p>
        <input
          name="imageUrl"
          value={imageUrl}
          onChange={(e) => setImageUrl(e.target.value)}
          placeholder="https://... (se completa solo, o pegá un link vos)"
          className="w-full px-3.5 py-2.5 rounded-xl border border-line bg-cream outline-none focus:border-sage text-[0.9rem] mt-1"
        />
      </div>

      <fieldset>
        <legend className="text-[0.78rem] font-semibold text-ink-soft mb-1.5">
          ¿Para qué eventos? (elegí uno o varios)
        </legend>
        <div className="grid grid-cols-2 gap-1.5">
          {EVENTS.map((ev) => (
            <label
              key={ev.id}
              className="flex items-center gap-1.5 text-[0.82rem] text-ink"
            >
              <input type="checkbox" name="eventTypes" value={ev.id} />
              {ev.label}
            </label>
          ))}
        </div>
        <p className="text-[0.72rem] text-ink-soft/70 mt-1.5">
          Si no marcás ninguno, se muestra para todos los eventos.
        </p>
      </fieldset>

      <button
        type="submit"
        disabled={isSaving}
        className="mt-1 py-2.5 rounded-full bg-sage text-white font-semibold text-[0.85rem] hover:bg-sage-dark transition-colors disabled:opacity-60"
      >
        {isSaving ? "Agregando…" : "Agregar"}
      </button>
    </form>
  );
}
