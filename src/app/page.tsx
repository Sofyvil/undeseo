import { Icon } from "@/components/Icon";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

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

export default async function Home() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <main className="max-w-lg md:max-w-2xl lg:max-w-3xl mx-auto w-full px-5 md:px-8 py-8 md:py-14">
      {/* Barra de sesión */}
      <div className="flex justify-end mb-2">
        {user ? (
          <Link href="/mis-listas" className="text-[0.8rem] text-sage-dark font-semibold underline">
            Mis listas
          </Link>
        ) : (
          <Link href="/login" className="text-[0.8rem] text-sage-dark font-semibold underline">
            Iniciar sesión
          </Link>
        )}
      </div>

      {/* Hero */}
      <div className="text-center pt-4 pb-2">
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

      <div className="text-center">
        <Link
          href="/crear"
          className="inline-block px-10 py-3.5 rounded-full bg-sage text-white font-semibold hover:bg-sage-dark transition-colors"
        >
          Crear mi lista →
        </Link>
      </div>

      <footer className="mt-10 text-center pt-4.5 border-t-2 border-dashed border-line text-[0.78rem] text-ink-soft">
        <div className="flex items-center justify-center gap-3">
          <span className="flex items-center gap-1.5">
            <Icon name="gift" className="w-3.5 h-3.5 text-sage-dark" />
            Un Deseo
          </span>
          <span className="text-line">·</span>
          <Link href="/terminos" className="underline">
            Términos y Condiciones
          </Link>
        </div>
      </footer>
    </main>
  );
}
