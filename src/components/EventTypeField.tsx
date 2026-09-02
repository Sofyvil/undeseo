"use client";

import { useMemo, useState } from "react";

type EventOption = { id: string; label: string; image: string };

type SponsoredProductRow = {
  id: string;
  brand_name: string;
  product_name: string;
  image_url: string | null;
  product_url: string;
  event_type: string | null;
};

function pickRotatingIndex(length: number) {
  const dayOfYear = Math.floor(
    (Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) /
      86400000
  );
  return dayOfYear % length;
}

export function EventTypeField({
  events,
  sponsoredProducts,
}: {
  events: EventOption[];
  sponsoredProducts: SponsoredProductRow[];
}) {
  const [eventType, setEventType] = useState(events[0]?.id ?? "");

  const product = useMemo(() => {
    const forThisEvent = sponsoredProducts.filter(
      (p) => p.event_type === eventType
    );
    const generic = sponsoredProducts.filter((p) => !p.event_type);
    // Preferimos algo específico del evento elegido; si no hay, mostramos
    // uno genérico (de "todos los eventos").
    const pool = forThisEvent.length > 0 ? forThisEvent : generic;
    if (pool.length === 0) return null;
    return pool[pickRotatingIndex(pool.length)];
  }, [eventType, sponsoredProducts]);

  return (
    <div className="flex flex-col gap-4">
      <fieldset>
        <legend className="text-[0.78rem] font-semibold text-ink-soft mb-1.5">
          Tipo de evento
        </legend>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5">
          {events.map((ev, i) => (
            <label
              key={ev.id}
              className="border border-line rounded-2xl p-3 text-center cursor-pointer bg-white text-[0.85rem] font-semibold has-checked:border-sage has-checked:bg-sage/10 has-checked:text-sage-dark"
            >
              <input
                type="radio"
                name="eventType"
                value={ev.id}
                defaultChecked={i === 0}
                onChange={() => setEventType(ev.id)}
                className="sr-only"
              />
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={ev.image}
                alt=""
                className="w-6.5 h-6.5 mx-auto mb-1.5 object-contain"
              />
              <span>{ev.label}</span>
            </label>
          ))}
        </div>
      </fieldset>

      {product && (
        <a
          href={product.product_url}
          target="_blank"
          className="flex items-center gap-3 bg-white border border-line rounded-2xl p-3.5 hover:border-sage transition-colors"
        >
          {product.image_url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={product.image_url}
              alt={product.product_name}
              className="w-14 h-14 rounded-xl object-cover shrink-0 bg-cream-2"
            />
          ) : (
            <div className="w-14 h-14 rounded-xl bg-cream-2 shrink-0" />
          )}
          <div className="flex-1 min-w-0">
            <p className="font-mono-price text-[0.65rem] tracking-[0.08em] uppercase text-sage-dark font-semibold">
              {product.brand_name} · recomendado
            </p>
            <p className="font-semibold text-[0.88rem] truncate">
              {product.product_name}
            </p>
          </div>
        </a>
      )}
    </div>
  );
}
