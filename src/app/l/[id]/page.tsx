import { createClient } from "@/lib/supabase/server";
import { Icon } from "@/components/Icon";
import Link from "next/link";
import { reserveItem, unreserveItem, deleteItem, updateEventDetails } from "./actions";
import { notFound } from "next/navigation";
import { AddItemForm } from "./AddItemForm";
import { CopyLinkButton } from "./CopyLinkButton";
import { FlyerUploader } from "./FlyerUploader";
import { SponsoredItemCard } from "./SponsoredItemCard";
import { signOut } from "../../mis-listas/actions";

function pickRotatingIndex(length: number) {
  // Al azar en cada carga de página, así no se ve siempre el mismo.
  return Math.floor(Math.random() * length);
}

const CANVA_LINKS: Record<string, string> = {
  baby_shower: "https://www.canva.com/es_mx/invitaciones/plantillas/baby-shower/",
  nacimiento: "https://www.canva.com/es_mx/invitaciones/plantillas/baby-shower/",
  cumple: "https://www.canva.com/es_mx/invitaciones/plantillas/cumpleanos/",
  otro: "https://www.canva.com/es_mx/invitaciones/plantillas/",
};

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

  const { data: items } = await supabase
    .from("items")
    .select("*")
    .eq("list_id", id)
    .order("created_at", { ascending: false });

  const total = items?.length ?? 0;
  const reservedCount = items?.filter((i) => i.reserved).length ?? 0;
  const pct = total ? Math.round((reservedCount / total) * 100) : 0;

  let sponsoredProduct = null;
  if (isOwner) {
    const { data: sponsoredProducts } = await supabase
      .from("sponsored_products")
      .select("*")
      .eq("active", true);

    if (sponsoredProducts && sponsoredProducts.length > 0) {
      const forThisEvent = sponsoredProducts.filter(
        (p) => p.event_type === list.event_type
      );
      const generic = sponsoredProducts.filter((p) => !p.event_type);
      const pool = forThisEvent.length > 0 ? forThisEvent : generic;
      if (pool.length > 0) {
        sponsoredProduct = pool[pickRotatingIndex(pool.length)];
      }
    }
  }

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
        {isOwner && (
          <div className="flex items-center gap-3">
            <Link href="/mis-listas" className="text-[0.78rem] text-sage-dark font-semibold underline">
              ← Mis listas
            </Link>
            <form action={signOut}>
              <button className="text-[0.78rem] text-ink-soft underline">
                Cerrar sesión
              </button>
            </form>
          </div>
        )}
      </div>

      {/* Header de la lista: nombre + progreso */}
      <div className="bg-white rounded-[20px] p-5 md:p-7 border border-line mb-5">
        <p className="font-mono-price text-[0.68rem] tracking-[0.11em] uppercase text-sage-dark font-semibold">
          {EVENT_LABELS[list.event_type] ?? "Evento"}
        </p>
        <h1 className="font-display text-2xl font-semibold mt-1">
          {list.parents_name}
        </h1>

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

      {/* Datos del evento + flyer — pantalla partida, igual para organizador e invitados */}
      {(list.event_date || list.event_time || list.event_location || list.flyer_image_url) && (
        <div
          className={`bg-white rounded-[20px] border border-line mb-5 overflow-hidden ${
            list.flyer_image_url ? "md:grid md:grid-cols-2" : ""
          }`}
        >
          {/* Datos */}
          <div className="p-5 md:p-6 flex flex-col justify-center gap-2.5">
            {list.event_date && (
              <div className="flex items-center gap-2 text-[0.9rem] text-ink-soft">
                <Icon name="calendar" className="w-4.5 h-4.5 text-sage-dark shrink-0" />
                {fmtDate(list.event_date)}
              </div>
            )}
            {list.event_time && (
              <div className="flex items-center gap-2 text-[0.9rem] text-ink-soft">
                <Icon name="clock" className="w-4.5 h-4.5 text-sage-dark shrink-0" />
                {list.event_time} hs
              </div>
            )}
            {list.event_location && (
              <div className="flex items-center gap-2 text-[0.9rem] text-ink-soft">
                <Icon name="pin" className="w-4.5 h-4.5 text-sage-dark shrink-0" />
                {list.event_location}
              </div>
            )}
          </div>

          {/* Flyer — proporción vertical 4:5 (1080x1350), imagen completa sin recortar */}
          {list.flyer_image_url && (
            <div className="bg-cream-2 aspect-[4/5] max-w-72 mx-auto md:mx-0 md:my-6 md:mr-6 rounded-xl overflow-hidden flex items-center justify-center">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={list.flyer_image_url}
                alt="Invitación del evento"
                className="w-full h-full object-contain"
              />
            </div>
          )}
        </div>
      )}

      {/* Explicador para invitados: cómo funciona esto */}
      {!isOwner && (
        <div className="bg-white border border-line rounded-[20px] p-5 mb-5">
          <p className="font-display font-semibold text-[1.1rem] mb-3.5">
            ¿Cómo funciona?
          </p>
          <div className="flex flex-col gap-3.5">
            <div className="flex gap-3 items-start">
              <div className="w-9 h-9 shrink-0 rounded-xl bg-cream-2 flex items-center justify-center">
                <Icon name="list" className="w-4.5 h-4.5 text-sage-dark" />
              </div>
              <div>
                <p className="font-semibold text-[0.9rem]">Mirá todos los regalos</p>
                <p className="text-ink-soft text-[0.8rem] mt-0.5 leading-snug">
                  Elegí el que más te guste de la lista.
                </p>
              </div>
            </div>
            <div className="flex gap-3 items-start">
              <div className="w-9 h-9 shrink-0 rounded-xl bg-cream-2 flex items-center justify-center">
                <Icon name="gift" className="w-4.5 h-4.5 text-sage-dark" />
              </div>
              <div>
                <p className="font-semibold text-[0.9rem]">Reservalo</p>
                <p className="text-ink-soft text-[0.8rem] mt-0.5 leading-snug">
                  Marcarlo como reservado avisa a los demás que ya lo regalás vos, así nadie repite.
                </p>
              </div>
            </div>
            <div className="flex gap-3 items-start">
              <div className="w-9 h-9 shrink-0 rounded-xl bg-cream-2 flex items-center justify-center">
                <Icon name="tag" className="w-4.5 h-4.5 text-sage-dark" />
              </div>
              <div>
                <p className="font-semibold text-[0.9rem]">Comprálo en la tienda</p>
                <p className="text-ink-soft text-[0.8rem] mt-0.5 leading-snug">
                  Tocá el que elegiste y te lleva directo a la web del vendedor, donde se hace la compra.
                </p>
              </div>
            </div>
          </div>
          <p className="text-[0.74rem] text-ink-soft mt-4 pt-3.5 border-t border-line">
            Un Deseo no es una tienda — acá solo vas a encontrar la lista de regalos de {list.parents_name}.
          </p>
        </div>
      )}

      {/* Datos del evento + invitación (solo organizador) — panel de 2 columnas, todo opcional */}
      {isOwner && (
        <div className="bg-white rounded-[20px] border border-line p-4.5 mb-5 md:grid md:grid-cols-2 md:gap-6">
          {/* Columna izquierda: datos del evento */}
          <form action={updateEventDetails.bind(null, id)} className="flex flex-col gap-2.5">
            <p className="font-display font-semibold text-[1.05rem] mb-1">
              Datos del evento
            </p>
            <div>
              <label className="text-[0.72rem] font-semibold text-ink-soft block mb-1">
                Fecha
              </label>
              <input
                type="date"
                name="eventDate"
                defaultValue={list.event_date || ""}
                className="w-full px-3 py-2 rounded-lg border border-line outline-none focus:border-sage text-[0.85rem]"
              />
            </div>
            <div>
              <label className="text-[0.72rem] font-semibold text-ink-soft block mb-1">
                Hora
              </label>
              <input
                type="time"
                name="eventTime"
                defaultValue={list.event_time || ""}
                className="w-full px-3 py-2 rounded-lg border border-line outline-none focus:border-sage text-[0.85rem]"
              />
            </div>
            <div>
              <label className="text-[0.72rem] font-semibold text-ink-soft block mb-1">
                Lugar
              </label>
              <input
                name="eventLocation"
                defaultValue={list.event_location || ""}
                placeholder="Dirección o nombre del salón"
                className="w-full px-3 py-2 rounded-lg border border-line outline-none focus:border-sage text-[0.85rem]"
              />
            </div>
            <button
              type="submit"
              className="mt-1 py-2 rounded-full bg-sage text-white font-semibold text-[0.8rem] hover:bg-sage-dark transition-colors"
            >
              Guardar
            </button>
          </form>

          {/* Columna derecha: invitación */}
          <div className="flex flex-col mt-5 md:mt-0 md:pl-6 md:border-l md:border-line">
            <p className="font-display font-semibold text-[1.05rem] mb-2.5">
              Invitación
            </p>
            <FlyerUploader listId={id} currentUrl={list.flyer_image_url} />
            <a
              href={CANVA_LINKS[list.event_type] || CANVA_LINKS.otro}
              target="_blank"
              className="text-[0.78rem] text-sage-dark font-semibold underline mt-3 text-center"
            >
              Creá acá tu invitación ↗
            </a>
          </div>
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
        {isOwner && sponsoredProduct && (
          <SponsoredItemCard listId={id} product={sponsoredProduct} />
        )}
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
                  item.product_url ? (
                    <a href={item.product_url} target="_blank" className="w-full h-full block">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={item.image_url}
                        alt={item.name}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover"
                      />
                    </a>
                  ) : (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={item.image_url}
                      alt={item.name}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                    />
                  )
                ) : (
                  <Icon name="gift" className="w-9 h-9 text-sage-dark" />
                )}
              </div>
              <p className="font-semibold text-[0.88rem] leading-snug mb-0.5">
                {item.name}
              </p>
              {item.details && (
                <p className="text-[0.74rem] text-ink-soft mb-1">{item.details}</p>
              )}
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

      {isOwner && sponsoredProduct && (
        <Link
          href={`/l/${id}/sugeridos`}
          className="block text-center text-[0.82rem] text-sage-dark font-semibold underline mt-4"
        >
          Ver todos los sugeridos →
        </Link>
      )}

      {!isOwner && (
        <div className="mt-8 text-center bg-white border border-line rounded-[20px] p-6">
          <p className="font-display font-semibold text-[1.15rem]">
            ¿Vos también tenés un festejo?
          </p>
          <p className="text-ink-soft text-[0.85rem] mt-1.5 mb-4">
            Armá tu propia lista de regalos en un minuto, gratis.
          </p>
          <Link
            href="/crear"
            className="inline-block px-8 py-3 rounded-full bg-sage text-white font-semibold text-[0.9rem] hover:bg-sage-dark transition-colors"
          >
            Crear mi lista →
          </Link>
        </div>
      )}

      <footer className="mt-8 text-center pt-4.5 border-t-2 border-dashed border-line text-[0.78rem] text-ink-soft">
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
