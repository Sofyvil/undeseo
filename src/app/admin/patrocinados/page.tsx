import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { redirect } from "next/navigation";
import {
  addSponsoredProduct,
  toggleSponsoredProduct,
  deleteSponsoredProduct,
} from "./actions";

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
            Link de la imagen (opcional)
          </label>
          <input
            name="imageUrl"
            placeholder="https://..."
            className="w-full px-3.5 py-2.5 rounded-xl border border-line bg-cream outline-none focus:border-sage text-[0.9rem]"
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
        {products?.map((p) => (
          <div
            key={p.id}
            className={`bg-white border border-line rounded-xl p-3.5 flex items-center gap-3 ${
              !p.active ? "opacity-50" : ""
            }`}
          >
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
                {p.brand_name}
              </p>
            </div>
            <form
              action={toggleSponsoredProduct.bind(null, p.id, !p.active)}
            >
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
        ))}
      </div>
    </main>
  );
}
