"use client";

import { useState, type FormEvent, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import Image from "next/image";

function LoginForm() {
  const searchParams = useSearchParams();
  const next = searchParams.get("next") || "/mis-listas";

  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleGoogle() {
    const supabase = createClient();
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent(next)}`,
      },
    });
  }

  async function handleEmail(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent(next)}`,
      },
    });
    setLoading(false);
    if (error) setError("No pudimos enviarte el link. Probá de nuevo.");
    else setSent(true);
  }

  return (
    <main className="max-w-md mx-auto w-full px-5 py-14">
      <div className="text-center mb-8">
        <Image
          src="/stickers-login.png"
          alt=""
          width={900}
          height={491}
          className="w-full max-w-[340px] h-auto mx-auto mb-5"
        />
        <p className="font-display text-xl font-semibold text-ink">
          Entrá a Un Deseo para crear y guardar tus listas.
        </p>
      </div>

      <button
        onClick={handleGoogle}
        className="w-full flex items-center justify-center gap-2.5 py-3 rounded-full border border-line bg-white font-semibold text-[0.9rem] hover:bg-cream-2 transition-colors mb-5"
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
          alt=""
          className="w-5 h-5"
        />
        Continuar con Google
      </button>

      <div className="flex items-center gap-3 my-5">
        <div className="flex-1 h-px bg-line" />
        <span className="text-[0.75rem] text-ink-soft">o con tu mail</span>
        <div className="flex-1 h-px bg-line" />
      </div>

      {sent ? (
        <div className="bg-white border border-line rounded-xl p-4 text-center text-[0.88rem] text-ink-soft">
          Te mandamos un link a <strong className="text-ink">{email}</strong>.
          Abrilo desde este mismo dispositivo para entrar.
        </div>
      ) : (
        <form onSubmit={handleEmail} className="flex flex-col gap-3">
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="tu@mail.com"
            className="w-full px-3.5 py-3 rounded-xl border border-line bg-white outline-none focus:border-sage text-[0.95rem]"
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-full bg-sage text-white font-semibold text-[0.9rem] hover:bg-sage-dark transition-colors disabled:opacity-60"
          >
            {loading ? "Enviando…" : "Enviarme el link"}
          </button>
          {error && <p className="text-[0.8rem] text-rose-dark">{error}</p>}
        </form>
      )}
    </main>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginForm />
    </Suspense>
  );
}
