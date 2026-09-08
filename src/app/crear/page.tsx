import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { EVENTS } from "@/lib/events";
import { createList } from "../actions";
import { signOut } from "../mis-listas/actions";

export default async function CrearPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login?next=/crear");

  return (
    <main className="max-w-lg md:max-w-2xl mx-auto w-full px-5 md:px-8 py-8 md:py-14">
      <div className="text-center mb-6 relative">
        <form action={signOut} className="absolute right-0 top-0">
          <button className="text-[0.75rem] text-ink-soft underline">
            Cerrar sesión
          </button>
        </form>

        <div className="flex items-center justify-center gap-4 md:gap-6">
          <div className="w-[92px] shrink-0 -rotate-6">
            <svg viewBox="0 0 102 50" className="w-full h-auto drop-shadow-md">
              <g fill="#E7A2AC">
                <circle cx="18" cy="25" r="18" />
                <circle cx="40" cy="25" r="18" />
                <circle cx="62" cy="25" r="18" />
                <circle cx="84" cy="25" r="18" />
              </g>
              <text
                x="51"
                y="22"
                textAnchor="middle"
                fontSize="11.5"
                fontWeight="700"
                fill="#274734"
                fontFamily="var(--font-jost), sans-serif"
              >
                ✦ ¡Vamos!
              </text>
              <text
                x="51"
                y="34"
                textAnchor="middle"
                fontSize="8"
                fontWeight="600"
                fill="#274734"
                fontFamily="var(--font-jost), sans-serif"
              >
                armá tu lista
              </text>
            </svg>
          </div>
          <Image
            src="/logo-wordmark.png"
            alt="Un Deseo"
            width={1200}
            height={545}
            className="h-24 md:h-28 w-auto"
          />
        </div>

        <h1 className="font-display text-3xl font-bold text-ink mt-3">
          Armá tu lista
        </h1>
        <p className="text-ink-soft mt-2 text-[0.9rem]">
          Creando como <strong className="text-ink">{user.email}</strong>
        </p>
      </div>

      <form action={createList} className="flex flex-col gap-4 md:max-w-xl md:mx-auto">
        <div>
          <label className="text-[0.78rem] font-semibold text-ink-soft mb-1.5 block">
            ¿Cómo se llama el festejo?
          </label>
          <input
            name="parentsName"
            placeholder="Ej: Baby shower de Juli"
            required
            className="w-full px-3.5 py-3 rounded-xl border border-line bg-white outline-none focus:border-sage text-[0.95rem]"
          />
        </div>

        <fieldset>
          <legend className="text-[0.78rem] font-semibold text-ink-soft mb-1.5">
            Tipo de evento
          </legend>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5">
            {EVENTS.map((ev, i) => (
              <label
                key={ev.id}
                className="border border-line rounded-2xl p-3 text-center cursor-pointer bg-white text-[0.85rem] font-semibold has-checked:border-sage has-checked:bg-sage/10 has-checked:text-sage-dark"
              >
                <input
                  type="radio"
                  name="eventType"
                  value={ev.id}
                  defaultChecked={i === 0}
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

        <div className="grid grid-cols-2 gap-2.5">
          <div>
            <label className="text-[0.78rem] font-semibold text-ink-soft mb-1.5 block">
              Fecha (opcional)
            </label>
            <input
              type="date"
              name="eventDate"
              className="w-full px-3.5 py-3 rounded-xl border border-line bg-white outline-none focus:border-sage text-[0.95rem]"
            />
          </div>
          <div>
            <label className="text-[0.78rem] font-semibold text-ink-soft mb-1.5 block">
              Hora (opcional)
            </label>
            <input
              type="time"
              name="eventTime"
              className="w-full px-3.5 py-3 rounded-xl border border-line bg-white outline-none focus:border-sage text-[0.95rem]"
            />
          </div>
        </div>

        <div>
          <label className="text-[0.78rem] font-semibold text-ink-soft mb-1.5 block">
            Lugar (opcional)
          </label>
          <input
            name="eventLocation"
            placeholder="Ej: Salón Los Aromos, Villa Devoto"
            className="w-full px-3.5 py-3 rounded-xl border border-line bg-white outline-none focus:border-sage text-[0.95rem]"
          />
        </div>

        <label className="flex items-start gap-2.5 text-[0.8rem] text-ink-soft">
          <input
            type="checkbox"
            name="acceptedTerms"
            required
            className="mt-0.5 w-4 h-4 shrink-0 accent-sage"
          />
          <span>
            Leí y acepto los{" "}
            <Link href="/terminos" target="_blank" className="text-sage-dark font-semibold underline">
              Términos y Condiciones
            </Link>
            {" "}de Un Deseo.
          </span>
        </label>

        <button
          type="submit"
          className="w-full md:w-auto md:px-10 md:mx-auto py-3.5 rounded-full bg-sage text-white font-semibold hover:bg-sage-dark transition-colors"
        >
          Crear mi lista →
        </button>
      </form>
    </main>
  );
}
