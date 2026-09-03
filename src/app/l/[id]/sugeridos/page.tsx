import { createClient } from "@/lib/supabase/server";
import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { EVENT_LABELS } from "@/lib/events";
import { SponsoredItemCard } from "../SponsoredItemCard";

export default async function SugeridosPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: list } = await supabase
    .from("lists")
    .select("*")
    .eq("id", id)
    .single();

  if (!list) notFound();

  const isOwner = !!user && user.id === list.user_id;
  if (!isOwner) redirect(`/l/${id}`);

  const { data: sponsoredProducts } = await supabase
    .from("sponsored_products")
    .select("*")
    .eq("active", true);

  const products = (sponsoredProducts ?? []).filter(
    (p) => p.event_type === list.event_type || !p.event_type
  );

  return (
    <main className="max-w-lg md:max-w-3xl lg:max-w-5xl mx-auto w-full px-5 md:px-8 py-6 md:py-10">
      <Link
        href={`/l/${id}`}
        className="text-[0.78rem] text-sage-dark font-semibold underline mb-4 inline-block"
      >
        ← Volver a la lista
      </Link>

      <h1 className="font-display text-2xl font-bold text-ink mb-1">
        Sugeridos para {EVENT_LABELS[list.event_type] ?? "tu evento"}
      </h1>
      <p className="text-ink-soft text-[0.9rem] mb-6">
        Sumá los que te gusten directo a tu lista.
      </p>

      {products.length === 0 ? (
        <p className="text-ink-soft text-[0.9rem]">
          Todavía no hay sugeridos cargados para este tipo de evento.
        </p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
          {products.map((p) => (
            <SponsoredItemCard key={p.id} listId={id} product={p} />
          ))}
        </div>
      )}
    </main>
  );
}
