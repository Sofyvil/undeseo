import { createClient } from "@/lib/supabase/server";
import { Icon } from "@/components/Icon";
import Link from "next/link";
import { reserveItem, unreserveItem, deleteItem } from "./actions";
import { notFound } from "next/navigation";
import { AddItemForm } from "./AddItemForm";
import { CopyLinkButton } from "./CopyLinkButton";

const EVENT_LABELS: Record<string, string> = {
  baby_shower: "Baby shower",
  nacimiento: "Nacimiento",
  cumple: "Cumpleaños",
  otro: "Otro evento",
};

function money(n: number | null) {
  if (n === null || n === undefined) return null;
  return "$" + Number(n).toLocaleString("es-AR");
}

function fmtDate(d: string | null) {
  if (!d) return null;
  const date = new Date(d + "T00:00:00");
  return date.toLocaleDateString("es-AR", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export default async function ListPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ owner?: string }>;
}) {
  const { id } = await params;
  const { owner } = await searchParams;

  const supabase = await createClient();

  const { data: list } = await supabase
    .from("lists")
    .select("*")
    .eq("id", id)
    .single();

  if (!list) notFound();

  const isOwner = owner === list.owner_token;

  const { data: items } = await supabase
    .from("items")
    .select("*")
    .eq("list_id", id)
    .order("created_at", { ascending: false });

  const total = items?.length ?? 0;
  const reservedCount = items?.filter((i) => i.reserved).length ?? 0;
  const pct = total ? Math.round((reservedCount / total) * 100) : 0;

  const guestLink =
    (process.env.NEXT_PUBLIC_SITE_URL ?? "") + `/l/${id}`;

  return (
    <main className="max-w-lg md:max-w-3xl lg:max-w-5xl mx-auto w-full px-5 md:px-8 py-6 md:py-10">
      <div className="flex items-center justify-between mb-4">
        <span
          className={`font-mono-price text-[0.68rem] px-2.5 py-1 rounded-full font-semibold text-white ${
            isOwner ? "bg-rose" : "bg-sage"
          }`}
        >
          {isOwner ? "✏️ Vista organizador" : "👀 Vista invitado"}
        </span>
      </div>

      {/* Header de la lista */}
      <div className="bg-white rounded-[20px] p-5 md:p-7 border border-line mb-5">
        {list.flyer_image_url && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={list.flyer_image_url}
            alt="Flyer del evento"
            className="w-full rounded-xl mb-3.5 max-h-[340px] object-cover"
          />
        )}
        <p className="font-mono-price text-[0.68rem] tracking-[0.11em] uppercase text-sage-dark font-semibold">
          {EVENT_LABELS[list.event_type] ?? "Evento"}
        </p>
        <h1 className="font-display text-2xl font-semibold mt-1">
          {list.parents_name}
        </h1>

        <div className="flex flex-col gap-1.5 mt-2.5">
          {list.event_date && (
            <div className="flex items-center gap-2 text-[0.85rem] text-ink-soft">
              <Icon name="calendar" className="w-4 h-4 text-sage-dark shrink-0" />
              {fmtDate(list.event_date)}
            </div>
          )}
          {list.event_time && (
            <div className="flex items-center gap-2 text-[0.85rem] text-ink-soft">
              <Icon name="clock" className="w-4 h-4 text-sage-dark shrink-0" />
              {list.event_time} hs
            </div>
          )}
          {list.event_location && (
            <div className="flex items-center gap-2 text-[0.85rem] text-ink-soft">
              <Icon name="pin" className="w-4 h-4 text-sage-dark shrink-0" />
              {list.event_location}
            </div>
          )}
        </div>

        {total > 0 && (
          <div className="flex items-center gap-2.5 mt-3">
            <div className="flex-1 h-2 rounded-full bg-cream-2 overflow-hidden">
              <div
                className="h-full bg-sage rounded-full transition-all"
                style={{ width: `${pct}%` }}
              />
            </div>
            <span className="text-ink-soft text-[0.78rem] whitespace-nowrap">
              {reservedCount}/{total} regalados
            </span>
          </div>
        )}
      </div>

      {/* Banner aclaratorio para invitados: Un Deseo no es una tienda */}
      {!isOwner && (
        <div className="bg-cream-2 border border-line rounded-2xl px-4 py-3 mb-5 flex gap-2.5 items-start">
          <Icon name="tag" className="w-4 h-4 text-sage-dark shrink-0 mt-0.5" />
          <p className="text-[0.78rem] text-ink-soft leading-snug">
            Un Deseo no es una tienda: reservar acá avisa que ya elegiste el
            regalo, pero <strong className="text-ink">la compra se hace en la tienda original</strong>{" "}
            (tocá &quot;Ver producto&quot; para ir). No gestionamos pagos, stock ni envíos.
          </p>
        </div>
      )}

      {/* Compartir (solo organizador) — barra compacta, sin competir con "Agregar regalo" */}
      {isOwner && (
        <div className="bg-forest text-white rounded-2xl px-4 py-3.5 mb-5 flex items-center gap-3">
          <Icon name="share" className="w-4.5 h-4.5 text-white/80 shrink-0" />
          <div className="flex-1 min-w-0">
            <p className="text-[0.72rem] text-white/60 leading-none mb-1.5">
              Link para tus invitados
            </p>
            <div className="bg-white/15 rounded-lg px-2.5 py-1.5 w-full">
              <p className="font-mono-price text-[0.75rem] truncate text-white/95">
                {guestLink}
              </p>
            </div>
          </div>
          <CopyLinkButton link={guestLink} />
        </div>
      )}

      {/* Agregar regalo (solo organizador) */}
      {isOwner && <AddItemForm listId={id} />}

      {/* Grilla de regalos */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
        {total === 0 ? (
          <div className="col-span-2 text-center py-10 px-5 text-ink-soft">
            <p className="text-3xl mb-2">🎁</p>
            <p>
              Todavía no hay regalos en la lista.
              {isOwner ? " Agregá el primero arriba." : ""}
            </p>
          </div>
        ) : (
          items!.map((item) => (
            <div
              key={item.id}
              className={`bg-white rounded-2xl border-2 border-dashed border-line p-2.5 relative ${
                item.reserved ? "opacity-60" : ""
              }`}
            >
              <div className="w-full aspect-square rounded-xl bg-cream-2 flex items-center justify-center overflow-hidden mb-2.5">
                {item.image_url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={item.image_url}
                    alt={item.name}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <Icon name="gift" className="w-9 h-9 text-sage-dark" />
                )}
              </div>
              <p className="font-semibold text-[0.88rem] leading-snug mb-0.5">
                {item.name}
              </p>
              {money(item.price) ? (
                <span className="font-mono-price text-[0.78rem] font-semibold text-sage-dark bg-sage/10 px-2 py-0.5 rounded">
                  {money(item.price)}
                </span>
              ) : (
                <span className="font-mono-price text-[0.78rem] text-ink-soft/70">
                  Ver precio en la tienda
                </span>
              )}
              {item.product_url && (
                <a
                  href={item.product_url}
                  target="_blank"
                  className="block text-[0.78rem] text-ink-soft underline mt-1.5"
                >
                  Ver producto ↗
                </a>
              )}

              {item.reserved ? (
                <>
                  <p className="text-[0.72rem] font-semibold text-rose-dark font-mono-price mt-1.5">
                    ✓ Reservado por {item.reserved_by}
                  </p>
                  {!isOwner && (
                    <form action={unreserveItem.bind(null, id, item.id)}>
                      <button className="text-[0.75rem] text-ink-soft underline mt-1">
                        ¿Te equivocaste? Deshacer
                      </button>
                    </form>
                  )}
                </>
              ) : (
                !isOwner && (
                  <form
                    action={async (fd: FormData) => {
                      "use server";
                      await reserveItem(
                        id,
                        item.id,
                        fd.get("guestName") as string
                      );
                    }}
                    className="mt-2 flex flex-col gap-1.5"
                  >
                    <input
                      name="guestName"
                      placeholder="Tu nombre"
                      required
                      className="px-2.5 py-1.5 rounded-lg border border-line text-[0.78rem] outline-none focus:border-sage"
                    />
                    <button className="py-1.5 rounded-full bg-rose text-white font-semibold text-[0.78rem] hover:bg-rose-dark transition-colors">
                      Lo regalo yo 🎁
                    </button>
                  </form>
                )
              )}

              {isOwner && (
                <form action={deleteItem.bind(null, id, item.id)} className="mt-1.5">
                  <button className="text-[0.75rem] text-ink-soft underline">
                    Quitar
                  </button>
                </form>
              )}
            </div>
          ))
        )}
      </div>

      <footer className="mt-8 text-center pt-4.5 border-t-2 border-dashed border-line text-[0.78rem] text-ink-soft">
        <div className="flex items-center justify-center gap-3">
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
