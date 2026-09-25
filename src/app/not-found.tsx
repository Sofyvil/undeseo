import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Página no encontrada — Un Deseo",
};

const CONTACT_EMAIL = "listasundeseo@gmail.com";

export default function NotFound() {
  return (
    <main className="mx-auto flex w-full max-w-md flex-1 flex-col items-center justify-center px-5 py-14 text-center">
      <Link href="/" aria-label="Ir al inicio de Un Deseo">
        <Image
          src="/logo-wordmark.png"
          alt="Un Deseo"
          width={1200}
          height={545}
          className="mx-auto h-24 w-auto"
        />
      </Link>

      <p className="sr-only">Error 404</p>
      <p
        aria-hidden="true"
        className="mt-6 font-display text-[5.5rem] font-bold leading-none text-ink"
      >
        404
      </p>

      <h1 className="mt-5 font-display text-2xl font-semibold text-ink">
        Ups, esta página no existe
      </h1>
      <p className="mt-3 text-[0.95rem] leading-snug text-ink-soft">
        Puede que el link esté incompleto o que la lista ya no esté disponible.
        Revisá que el link esté completo o pedile uno nuevo a quien te lo
        compartió.
      </p>

      <Link
        href="/"
        className="mt-7 inline-block rounded-full bg-sage px-10 py-3.5 font-semibold text-white transition-colors hover:bg-sage-dark"
      >
        Ir al inicio
      </Link>

      <div className="mt-10 w-full border-t-2 border-dashed border-line pt-4.5 text-[0.82rem] text-ink-soft">
        ¿Necesitás ayuda? Escribinos a{" "}
        <a
          href={`mailto:${CONTACT_EMAIL}?subject=Ayuda%20con%20Un%20Deseo`}
          className="font-semibold text-sage-dark underline"
        >
          {CONTACT_EMAIL}
        </a>
      </div>
    </main>
  );
}
