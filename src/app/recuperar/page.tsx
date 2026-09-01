"use client";

import { useActionState } from "react";
import Link from "next/link";
import { Icon } from "@/components/Icon";
import { recoverAccess } from "./actions";

const initialState = { ok: false, message: "" };

export default function RecuperarPage() {
  const [state, formAction, isPending] = useActionState(
    async (_prev: typeof initialState, formData: FormData) => {
      return await recoverAccess(formData);
    },
    initialState
  );

  return (
    <main className="max-w-lg mx-auto w-full px-5 py-10">
      <div className="text-center pt-6 pb-2">
        <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-sage flex items-center justify-center -rotate-6">
          <Icon name="tag" className="w-6 h-6 text-white" />
        </div>
        <h1 className="font-display text-3xl font-bold">
          Recuperar acceso
        </h1>
        <p className="text-ink-soft mt-2 text-[0.92rem]">
          Poné el mail que usaste al armar tu lista y te mandamos el link de
          organizador/a de nuevo.
        </p>
      </div>

      <form action={formAction} className="flex flex-col gap-3 mt-6">
        <input
          name="email"
          type="email"
          required
          placeholder="tu@mail.com"
          className="w-full px-3.5 py-3 rounded-xl border border-line bg-white outline-none focus:border-sage text-[0.95rem]"
        />
        <button
          type="submit"
          disabled={isPending}
          className="w-full py-3.5 rounded-full bg-sage text-white font-semibold hover:bg-sage-dark transition-colors disabled:opacity-60"
        >
          {isPending ? "Enviando..." : "Enviarme el link"}
        </button>
      </form>

      {state.message && (
        <div className="mt-5 bg-white border border-line rounded-xl p-4 text-[0.88rem] text-ink-soft">
          {state.message}
        </div>
      )}

      <div className="mt-8 text-center">
        <Link href="/" className="text-sage-dark text-[0.85rem] font-semibold">
          ← Volver al inicio
        </Link>
      </div>
    </main>
  );
}
