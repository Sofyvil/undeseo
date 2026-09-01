import { Icon } from "@/components/Icon";
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
    <main className="max-w-lg mx-auto w-full px-5 py-8">
      {/* Hero */}
      <div className="text-center pt-6 pb-2">
        <div className="w-15 h-15 mx-auto mb-4 rounded-2xl bg-sage flex items-center justify-center -rotate-6 shadow-lg shadow-sage-dark/25">
          <Icon name="tag" className="w-7 h-7 text-white" />
        </div>
        <p className="font-mono-price text-[0.68rem] tracking-[0.11em] uppercase text-sage-dark font-semibold">
          Un Deseo · by Go Baby
        </p>
        <h1 className="font-display text-4xl font-bold mt-2 leading-tight">
          Armá la lista
          <br />
          en un minuto
        </h1>
        <p className="text-ink-soft mt-3 text-[0.95rem]">
          Pegás los links de lo que querés recibir. Tus invitados eligen y
          marcan qué ya regalaron, sin repetidos.
        </p>
      </div>

      {/* Cómo funciona */}
      <div className="flex flex-col gap-4 my-7">
        {HOW_IT_WORKS.map((step, i) => (
          <div key={step.title} className="flex gap-3.5 items-start">
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
      <form action={createList} className="flex flex-col gap-4">
        <div>
          <label className="text-[0.78rem] font-semibold text-ink-soft mb-1.5 block">
            ¿Cómo se llama el festejo?
          </label>
          <input
            name="parentsName"
            placeholder="Ej: Baby shower de Juli y Fede"
            required
            className="w-full px-3.5 py-3 rounded-xl border border-line bg-white outline-none focus:border-sage text-[0.95rem]"
          />
        </div>

        <fieldset>
          <legend className="text-[0.78rem] font-semibold text-ink-soft mb-1.5">
            Tipo de evento
          </legend>
          <div className="grid grid-cols-2 gap-2.5">
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

        <button
          type="submit"
          className="w-full py-3.5 rounded-full bg-sage text-white font-semibold hover:bg-sage-dark transition-colors"
        >
          Crear mi lista →
        </button>
      </form>

      <footer className="mt-8 text-center pt-4.5 border-t-2 border-dashed border-line text-[0.78rem] text-ink-soft">
        Hecho con 💛 por{" "}
        <a href="https://www.gobaby.com.ar" className="text-sage-dark font-semibold">
          Go Baby
        </a>
      </footer>
    </main>
  );
}
