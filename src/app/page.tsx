import { Icon } from "@/components/Icon";
import Link from "next/link";
import { createList } from "./actions";

const EVENTS = [
  { id: "baby_shower", label: "Baby shower", icon: "balloon" as const },
  { id: "nacimiento", label: "Nacimiento", icon: "newborn" as const },
  { id: "cumple", label: "Cumpleaños", icon: "cake" as const },
  { id: "otro", label: "Otro evento", icon: "sparkle" as const },
];

const HOW_IT_WORKS = [
  {
    icon: "list" as const,
    title: "Armás tu lista",
    desc: "Le ponés nombre a tu evento y sumás los regalos que querés recibir.",
  },
  {
    icon: "share" as const,
    title: "Compartís el link",
    desc: "Por WhatsApp, a quien quieras. Tus invitados lo abren sin registrarse.",
  },
  {
    icon: "gift" as const,
    title: "Cada uno reserva lo suyo",
    desc: "Eligen un regalo y lo marcan como propio. Nadie repite, nadie se cruza.",
  },
];

export default function Home() {
  return (
    <main className="max-w-lg md:max-w-2xl lg:max-w-3xl mx-auto w-full px-5 md:px-8 py-8 md:py-14">
      {/* Hero */}
      <div className="text-center pt-6 pb-2">
        <div className="w-15 h-15 mx-auto mb-4 rounded-2xl bg-sage flex items-center justify-center -rotate-6 shadow-lg shadow-sage-dark/25">
          <Icon name="tag" className="w-7 h-7 text-white" />
        </div>
        <p className="font-mono-price text-[0.68rem] tracking-[0.11em] uppercase text-sage-dark font-semibold">
          Un Deseo
        </p>
        <h1 className="font-display text-4xl md:text-5xl font-bold mt-2 leading-tight text-[#2B2A24]">
          Una lista,
          <br />
          todas las tiendas
        </h1>
        <p className="text-ink-soft mt-3 text-[0.95rem] md:text-base md:max-w-md md:mx-auto">
          Pegás los links de lo que querés recibir. Tus invitados eligen y
          reservan qué regalarte, sin repetidos.
        </p>
      </div>

      {/* Cómo funciona */}
      <div className="flex flex-col gap-4 my-7 md:grid md:grid-cols-3 md:gap-5">
        {HOW_IT_WORKS.map((step, i) => (
          <div key={step.title} className="flex gap-3.5 items-start md:flex-col md:gap-2.5">
            <div className="w-10.5 h-10.5 shrink-0 rounded-xl bg-white border border-line flex items-center justify-center">
              <Icon name={step.icon} className="w-5 h-5 text-sage-dark" />
            </div>
            <div>
              <p className="font-mono-price text-[0.65rem] font-semibold tracking-[0.08em] uppercase text-sage-dark mb-0.5">
                Paso {i + 1}
              </p>
              <p className="font-display font-semibold text-[1.05rem]">
                {step.title}
              </p>
              <p className="text-ink-soft text-[0.83rem] mt-0.5 leading-snug">
                {step.desc}
              </p>
            </div>
          </div>
        ))}
      </div>

      <hr className="border-t-2 border-dashed border-line my-5" />

      {/* Formulario de creación */}
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

        <div>
          <label className="text-[0.78rem] font-semibold text-ink-soft mb-1.5 block">
            Tu mail
          </label>
          <input
            name="ownerEmail"
            type="email"
            placeholder="tu@mail.com"
            required
            className="w-full px-3.5 py-3 rounded-xl border border-line bg-white outline-none focus:border-sage text-[0.95rem]"
          />
          <p className="text-[0.72rem] text-ink-soft mt-1.5">
            Lo usamos solo para poder devolverte el acceso a tu lista si perdés el link. Nunca lo compartimos ni lo usamos para otra cosa.
          </p>
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
                <Icon
                  name={ev.icon}
                  className="w-6.5 h-6.5 mx-auto mb-1.5 text-sage-dark"
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

      <footer className="mt-8 text-center pt-4.5 border-t-2 border-dashed border-line text-[0.78rem] text-ink-soft">
        <Link href="/recuperar" className="text-sage-dark font-semibold">
          ¿Ya armaste una lista y perdiste el acceso?
        </Link>
        <div className="mt-3 flex items-center justify-center gap-3">
          <span>Un Deseo</span>
          <span className="text-line">·</span>
          <Link href="/terminos" className="underline">
            Términos y Condiciones
          </Link>
        </div>
      </footer>
    </main>
  );
}
