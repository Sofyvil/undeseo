import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Icon } from "@/components/Icon";
import { signOut } from "./actions";
import { DeleteListButton } from "./DeleteListButton";

const EVENT_LABELS: Record<string, string> = {
  baby_shower: "Baby shower",
  nacimiento: "Nacimiento",
  cumple: "Cumpleaños",
  otro: "Otro evento",
};

export default async function MisListasPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login?next=/mis-listas");

  const { data: lists } = await supabase
    .from("lists")
    .select("id, parents_name, event_type, created_at")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  return (
    <main className="max-w-lg md:max-w-2xl mx-auto w-full px-5 py-8">
      <div className="flex items-center justify-between mb-1">
        <h1 className="font-display text-2xl font-bold">Mis listas</h1>
        <form action={signOut}>
          <button className="text-[0.78rem] text-ink-soft underline">
            Cerrar sesión
          </button>
        </form>
      </div>
      <p className="text-[0.8rem] text-ink-soft mb-6">{user.email}</p>

      <Link
        href="/crear"
        className="block w-full text-center py-3.5 rounded-full bg-sage text-white font-semibold mb-6 hover:bg-sage-dark transition-colors"
      >
        + Crear nueva lista
      </Link>

      {!lists || lists.length === 0 ? (
        <div className="text-center py-10 text-ink-soft">
          <Icon name="gift" className="w-9 h-9 mx-auto mb-2 text-sage-dark" />
          <p>Todavía no armaste ninguna lista.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {lists.map((l) => (
            <div
              key={l.id}
              className="bg-white border border-line rounded-2xl p-4 flex items-center justify-between hover:border-sage transition-colors"
            >
              <Link href={`/l/${l.id}`} className="flex-1 min-w-0">
                <p className="font-semibold truncate">{l.parents_name}</p>
                <p className="text-[0.78rem] text-ink-soft">
                  {EVENT_LABELS[l.event_type] ?? "Evento"}
                </p>
              </Link>
              <div className="flex items-center gap-3 shrink-0">
                <DeleteListButton listId={l.id} listName={l.parents_name} />
                <Link href={`/l/${l.id}`}>
                  <Icon name="gift" className="w-5 h-5 text-sage-dark" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
