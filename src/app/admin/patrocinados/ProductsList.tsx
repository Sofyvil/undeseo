"use client";

import { useMemo, useState } from "react";
import { EVENTS, EVENT_LABELS } from "@/lib/events";
import {
  editSponsoredProduct,
  toggleSponsoredProduct,
  deleteSponsoredProduct,
} from "./actions";

type SponsoredProduct = {
  id: string;
  brand_name: string;
  product_name: string;
  price: number | null;
  details: string | null;
  image_url: string | null;
  product_url: string;
  event_types: string[] | null;
  active: boolean;
};

function eventNames(eventTypes: string[] | null) {
  if (!eventTypes || eventTypes.length === 0) return "Todos los eventos";
  return eventTypes.map((id) => EVENT_LABELS[id] ?? id).join(", ");
}

export function SponsoredProductsList({
  products,
}: {
  products: SponsoredProduct[];
}) {
  const [filter, setFilter] = useState("");

  const filtered = useMemo(() => {
    if (!filter) return products;
    return products.filter((p) =>
      filter === "__todos__"
        ? !p.event_types || p.event_types.length === 0
        : p.event_types?.includes(filter)
    );
  }, [products, filter]);

  return (
    <div>
      <div className="flex items-center justify-between mb-3 gap-3">
        <p className="font-display font-semibold text-[1.05rem]">
          Cargados ({filtered.length}
          {filter ? ` de ${products.length}` : ""})
        </p>
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="text-[0.82rem] px-2.5 py-1.5 rounded-lg border border-line bg-white outline-none"
        >
          <option value="">Filtrar por evento (todos)</option>
          {EVENTS.map((ev) => (
            <option key={ev.id} value={ev.id}>
              {ev.label}
            </option>
          ))}
          <option value="__todos__">Solo &quot;todos los eventos&quot;</option>
        </select>
      </div>

      <div className="flex flex-col gap-2.5">
        {filtered.length === 0 && (
          <p className="text-ink-soft text-[0.85rem]">
            No hay productos cargados para este filtro.
          </p>
        )}
        {filtered.map((p) => (
          <div
            key={p.id}
            className={`bg-white border border-line rounded-xl p-3.5 ${
              !p.active ? "opacity-50" : ""
            }`}
          >
            <div className="flex items-center gap-3">
              {p.image_url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={p.image_url}
                  alt=""
                  className="w-12 h-12 rounded-lg object-cover shrink-0 bg-cream-2"
                />
              ) : (
                <div className="w-12 h-12 rounded-lg bg-cream-2 shrink-0" />
              )}
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-[0.88rem] truncate">
                  {p.product_name}
                </p>
                <p className="text-ink-soft text-[0.78rem] truncate">
                  {p.brand_name} · {eventNames(p.event_types)}
                  {p.price ? ` · $${Number(p.price).toLocaleString("es-AR")}` : ""}
                </p>
              </div>
              <form action={toggleSponsoredProduct.bind(null, p.id, !p.active)}>
                <button className="text-[0.75rem] font-semibold text-sage-dark underline shrink-0">
                  {p.active ? "Pausar" : "Activar"}
                </button>
              </form>
              <form action={deleteSponsoredProduct.bind(null, p.id)}>
                <button className="text-[0.75rem] text-rose-dark underline shrink-0">
                  Borrar
                </button>
              </form>
            </div>

            <details className="mt-2.5">
              <summary className="text-[0.75rem] text-ink-soft underline cursor-pointer select-none">
                Editar
              </summary>
              <form
                action={editSponsoredProduct.bind(null, p.id)}
                className="flex flex-col gap-2.5 mt-3 pt-3 border-t border-line"
              >
                <div>
                  <label className="text-[0.75rem] font-semibold text-ink-soft mb-1 block">
                    Marca
                  </label>
                  <input
                    name="brandName"
                    required
                    defaultValue={p.brand_name}
                    className="w-full px-3 py-2 rounded-lg border border-line bg-cream outline-none focus:border-sage text-[0.85rem]"
                  />
                </div>
                <div>
                  <label className="text-[0.75rem] font-semibold text-ink-soft mb-1 block">
                    Nombre del producto
                  </label>
                  <input
                    name="productName"
                    required
                    defaultValue={p.product_name}
                    className="w-full px-3 py-2 rounded-lg border border-line bg-cream outline-none focus:border-sage text-[0.85rem]"
                  />
                </div>
                <div>
                  <label className="text-[0.75rem] font-semibold text-ink-soft mb-1 block">
                    Detalle
                  </label>
                  <input
                    name="details"
                    defaultValue={p.details ?? ""}
                    className="w-full px-3 py-2 rounded-lg border border-line bg-cream outline-none focus:border-sage text-[0.85rem]"
                  />
                </div>
                <div>
                  <label className="text-[0.75rem] font-semibold text-ink-soft mb-1 block">
                    Precio
                  </label>
                  <input
                    name="price"
                    type="number"
                    step="0.01"
                    defaultValue={p.price ?? ""}
                    className="w-full px-3 py-2 rounded-lg border border-line bg-cream outline-none focus:border-sage text-[0.85rem]"
                  />
                </div>
                <div>
                  <label className="text-[0.75rem] font-semibold text-ink-soft mb-1 block">
                    Cambiar imagen (subir archivo nuevo)
                  </label>
                  <input
                    name="imageFile"
                    type="file"
                    accept="image/*"
                    className="w-full text-[0.8rem]"
                  />
                  <p className="text-[0.7rem] text-ink-soft/70 mt-1">
                    o pegá un link nuevo (si no tocás nada, se mantiene la imagen actual):
                  </p>
                  <input
                    name="imageUrl"
                    placeholder="https://..."
                    className="w-full px-3 py-2 rounded-lg border border-line bg-cream outline-none focus:border-sage text-[0.85rem] mt-1"
                  />
                </div>
                <div>
                  <label className="text-[0.75rem] font-semibold text-ink-soft mb-1 block">
                    Link del producto
                  </label>
                  <input
                    name="productUrl"
                    required
                    defaultValue={p.product_url}
                    className="w-full px-3 py-2 rounded-lg border border-line bg-cream outline-none focus:border-sage text-[0.85rem]"
                  />
                </div>
                <fieldset>
                  <legend className="text-[0.75rem] font-semibold text-ink-soft mb-1.5">
                    ¿Para qué eventos?
                  </legend>
                  <div className="grid grid-cols-2 gap-1.5">
                    {EVENTS.map((ev) => (
                      <label
                        key={ev.id}
                        className="flex items-center gap-1.5 text-[0.8rem] text-ink"
                      >
                        <input
                          type="checkbox"
                          name="eventTypes"
                          value={ev.id}
                          defaultChecked={p.event_types?.includes(ev.id)}
                        />
                        {ev.label}
                      </label>
                    ))}
                  </div>
                </fieldset>
                <button
                  type="submit"
                  className="py-2 rounded-full bg-sage text-white font-semibold text-[0.8rem] hover:bg-sage-dark transition-colors"
                >
                  Guardar cambios
                </button>
              </form>
            </details>
          </div>
        ))}
      </div>
    </div>
  );
}
