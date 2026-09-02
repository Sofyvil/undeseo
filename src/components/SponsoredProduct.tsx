import { createClient } from "@/lib/supabase/server";

function pickRotatingIndex(length: number) {
  const dayOfYear = Math.floor(
    (Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) /
      86400000
  );
  return dayOfYear % length;
}

export async function SponsoredProduct() {
  const supabase = await createClient();
  const { data: products } = await supabase
    .from("sponsored_products")
    .select("*")
    .eq("active", true);

  if (!products || products.length === 0) return null;

  // Rota según el día del año, así todos los que entran el mismo día ven
  // el mismo producto, pero cambia día a día sin que haga falta tocar nada.
  const product = products[pickRotatingIndex(products.length)];

  return (
    <a
      href={product.product_url}
      target="_blank"
      className="flex items-center gap-3 bg-white border border-line rounded-2xl p-3.5 mb-5 hover:border-sage transition-colors"
    >
      {product.image_url ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={product.image_url}
          alt={product.product_name}
          className="w-14 h-14 rounded-xl object-cover shrink-0 bg-cream-2"
        />
      ) : (
        <div className="w-14 h-14 rounded-xl bg-cream-2 shrink-0" />
      )}
      <div className="flex-1 min-w-0">
        <p className="font-mono-price text-[0.65rem] tracking-[0.08em] uppercase text-sage-dark font-semibold">
          {product.brand_name} · recomendado
        </p>
        <p className="font-semibold text-[0.88rem] truncate">
          {product.product_name}
        </p>
      </div>
    </a>
  );
}
