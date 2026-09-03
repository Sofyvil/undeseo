import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { redirect } from "next/navigation";
import { EVENT_LABELS } from "@/lib/events";
import {
  addSponsoredProduct,
  editSponsoredProduct,
  toggleSponsoredProduct,
  deleteSponsoredProduct,
} from "./actions";

type SponsoredProduct = {
  id: string;
  brand_name: string;
  product_name: string;
  price: number | null;
  details: string | null;
  image_url: string | null;
  product_url: string;
  event_type: string | null;
  active: boolean;
};

function EventSelect({ defaultValue }: { defaultValue: string }) {
  return (
    <select
      name="eventType"
      defaultValue={defaultValue}
      className="w-full px-3.5 py-2.5 rounded-xl border border-line bg-cream outline-none focus:border-sage text-[0.9rem]"
    >
      <option value="">Todos los eventos</option>
      {Object.entries(EVENT_LABELS).map(([id, label]) => (
        <option key={id} value={id}>
          {label}
        </option>
      ))}
    </select>
  );
}

export default async function PatrocinadosAdminPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login?next=/admin/patrocinados");
  if (user.email !== process.env.ADMIN_EMAIL) redirect("/");

  const admin = createAdminClient();
  const { data: products } = await admin
    .from("sponsored_products")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <main className="max-w-2xl mx-auto w-full px-5 md:px-8 py-8 md:py-14">
      <h1 className="font-display text-2xl font-bold text-ink mb-1">
        Productos patrocinados
      </h1>
      <p className="text-ink-soft text-[0.9rem] mb-6">
        Se muestran de forma rotativa en la pantalla donde la gente arma su
        lista. Solo vos podés ver y editar esta página.
      </p>

      <form
        action={addSponsoredProduct}
        className="bg-white border border-line rounded-2xl p-5 flex flex-col gap-3 mb-8"
      >
        <p className="font-display font-semibold text-[1.05rem] mb-1">
          Agregar producto
        </p>
        <div>
          <label className="text-[0.78rem] font-semibold text-ink-soft mb-1 block">
            Marca
          </label>
          <input
            name="brandName"
            required
            placeholder="Ej: Bebesit"
            className="w-full px-3.5 py-2.5 rounded-xl border border-line bg-cream outline-none focus:border-sage text-[0.9rem]"
          />
        </div>
        <div>
          <label className="text-[0.78rem] font-semibold text-ink-soft mb-1 block">
            Nombre del producto
          </label>
          <input
            name="productName"
            required
            placeholder="Ej: Mantita térmica orgánica"
            className="w-full px-3.5 py-2.5 rounded-xl border border-line bg-cream outline-none focus:border-sage text-[0.9rem]"
          />
        </div>
        <div>
          <label className="text-[0.78rem] font-semibold text-ink-soft mb-1 block">
            Detalle (opcional)
          </label>
          <input
            name="details"
            placeholder="Ej: Talle único, 5 colores a elección"
            className="w-full px-3.5 py-2.5 rounded-xl border border-line bg-cream outline-none focus:border-sage text-[0.9rem]"
          />
        </div>
        <div>
          <label className="text-[0.78rem] font-semibold text-ink-soft mb-1 block">
            Precio (opcional)
          </label>
          <input
            name="price"
            type="number"
            step="0.01"
            placeholder="Ej: 28500"
            className="w-full px-3.5 py-2.5 rounded-xl border border-line bg-cream outline-none focus:border-sage text-[0.9rem]"
          />
        </div>
        <div>
          <label className="text-[0.78rem] font-semibold text-ink-soft mb-1 block">
            Imagen: subí un archivo
          </label>
          <input
            name="imageFile"
            type="file"
            accept="image/*"
            className="w-full text-[0.85rem]"
          />
          <p className="text-[0.72rem] text-ink-soft/70 mt-1">
            o si preferís, pegá un link de imagen en vez de subir un archivo:
          </p>
          <input
            name="imageUrl"
            placeholder="https://..."
            className="w-full px-3.5 py-2.5 rounded-xl border border-line bg-cream outline-none focus:border-sage text-[0.9rem] mt-1"
          />
        </div>
        <div>
          <label className="text-[0.78rem] font-semibold text-ink-soft mb-1 block">
            Link del producto (a dónde va cuando lo tocan)
          </label>
          <input
            name="productUrl"
            required
            placeholder="https://..."
            className="w-full px-3.5 py-2.5 rounded-xl border border-line bg-cream outline-none focus:border-sage text-[0.9rem]"
          />
        </div>
        <div>
          <label className="text-[0.78rem] font-semibold text-ink-soft mb-1 block">
            ¿Para qué evento?
          </label>
          <EventSelect defaultValue="" />
        </div>
        <button
          type="submit"
          className="mt-1 py-2.5 rounded-full bg-sage text-white font-semibold text-[0.85rem] hover:bg-sage-dark transition-colors"
        >
          Agregar
        </button>
      </form>

      <p className="font-display font-semibold text-[1.05rem] mb-3">
        Cargados ({products?.length ?? 0})
      </p>
      <div className="flex flex-col gap-2.5">
        {products?.length === 0 && (
          <p className="text-ink-soft text-[0.85rem]">
            Todavía no cargaste ninguno.
          </p>
        )}
        {(products as SponsoredProduct[] | null)?.map((p) => (
          <div
            key={p.id}
            className={`bg-white border border-line rounded-xl p-3.5 ${
              !p.active ? "opacity-50" : ""
            }`}
          >
            <div className="flex items-center gap-3">
              {p.image_url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={p.image_url}
                  alt=""
                  className="w-12 h-12 rounded-lg object-cover shrink-0 bg-cream-2"
                />
              ) : (
                <div className="w-12 h-12 rounded-lg bg-cream-2 shrink-0" />
              )}
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-[0.88rem] truncate">
                  {p.product_name}
                </p>
                <p className="text-ink-soft text-[0.78rem] truncate">
                  {p.brand_name} ·{" "}
                  {p.event_type
                    ? EVENT_LABELS[p.event_type] ?? p.event_type
                    : "Todos los eventos"}
                  {p.price ? ` · $${Number(p.price).toLocaleString("es-AR")}` : ""}
                </p>
              </div>
              <form action={toggleSponsoredProduct.bind(null, p.id, !p.active)}>
                <button className="text-[0.75rem] font-semibold text-sage-dark underline shrink-0">
                  {p.active ? "Pausar" : "Activar"}
                </button>
              </form>
              <form action={deleteSponsoredProduct.bind(null, p.id)}>
                <button className="text-[0.75rem] text-rose-dark underline shrink-0">
                  Borrar
                </button>
              </form>
            </div>

            <details className="mt-2.5">
              <summary className="text-[0.75rem] text-ink-soft underline cursor-pointer select-none">
                Editar
              </summary>
              <form
                action={editSponsoredProduct.bind(null, p.id)}
                className="flex flex-col gap-2.5 mt-3 pt-3 border-t border-line"
              >
                <div>
                  <label className="text-[0.75rem] font-semibold text-ink-soft mb-1 block">
                    Marca
                  </label>
                  <input
                    name="brandName"
                    required
                    defaultValue={p.brand_name}
                    className="w-full px-3 py-2 rounded-lg border border-line bg-cream outline-none focus:border-sage text-[0.85rem]"
                  />
                </div>
                <div>
                  <label className="text-[0.75rem] font-semibold text-ink-soft mb-1 block">
                    Nombre del producto
                  </label>
                  <input
                    name="productName"
                    required
                    defaultValue={p.product_name}
                    className="w-full px-3 py-2 rounded-lg border border-line bg-cream outline-none focus:border-sage text-[0.85rem]"
                  />
                </div>
                <div>
                  <label className="text-[0.75rem] font-semibold text-ink-soft mb-1 block">
                    Detalle
                  </label>
                  <input
                    name="details"
                    defaultValue={p.details ?? ""}
                    className="w-full px-3 py-2 rounded-lg border border-line bg-cream outline-none focus:border-sage text-[0.85rem]"
                  />
                </div>
                <div>
                  <label className="text-[0.75rem] font-semibold text-ink-soft mb-1 block">
                    Precio
                  </label>
                  <input
                    name="price"
                    type="number"
                    step="0.01"
                    defaultValue={p.price ?? ""}
                    className="w-full px-3 py-2 rounded-lg border border-line bg-cream outline-none focus:border-sage text-[0.85rem]"
                  />
                </div>
                <div>
                  <label className="text-[0.75rem] font-semibold text-ink-soft mb-1 block">
                    Cambiar imagen (subir archivo nuevo)
                  </label>
                  <input
                    name="imageFile"
                    type="file"
                    accept="image/*"
                    className="w-full text-[0.8rem]"
                  />
                  <p className="text-[0.7rem] text-ink-soft/70 mt-1">
                    o pegá un link nuevo (si no tocás nada, se mantiene la imagen actual):
                  </p>
                  <input
                    name="imageUrl"
                    placeholder="https://..."
                    className="w-full px-3 py-2 rounded-lg border border-line bg-cream outline-none focus:border-sage text-[0.85rem] mt-1"
                  />
                </div>
                <div>
                  <label className="text-[0.75rem] font-semibold text-ink-soft mb-1 block">
                    Link del producto
                  </label>
                  <input
                    name="productUrl"
                    required
                    defaultValue={p.product_url}
                    className="w-full px-3 py-2 rounded-lg border border-line bg-cream outline-none focus:border-sage text-[0.85rem]"
                  />
                </div>
                <div>
                  <label className="text-[0.75rem] font-semibold text-ink-soft mb-1 block">
                    ¿Para qué evento?
                  </label>
                  <EventSelect defaultValue={p.event_type ?? ""} />
                </div>
                <button
                  type="submit"
                  className="py-2 rounded-full bg-sage text-white font-semibold text-[0.8rem] hover:bg-sage-dark transition-colors"
                >
                  Guardar cambios
                </button>
              </form>
            </details>
          </div>
        ))}
      </div>
    </main>
  );
}
