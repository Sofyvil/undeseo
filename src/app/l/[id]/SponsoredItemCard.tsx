import { addItem } from "./actions";

type SponsoredProductRow = {
  id: string;
  brand_name: string;
  product_name: string;
  price: number | null;
  details: string | null;
  image_url: string | null;
  product_url: string;
};

function money(n: number | null) {
  if (n === null || n === undefined) return null;
  return "$" + Number(n).toLocaleString("es-AR");
}

export function SponsoredItemCard({
  listId,
  product,
}: {
  listId: string;
  product: SponsoredProductRow;
}) {
  const addThisItem = addItem.bind(null, listId, {
    name: product.product_name,
    price: product.price,
    details: product.details,
    productUrl: product.product_url,
    imageUrl: product.image_url,
    source: "catalog" as const,
  });

  return (
    <div className="bg-white rounded-2xl border-2 border-rose p-2.5 relative">
      {/* Sticker ondulado, superpuesto en la esquina */}
      <div className="absolute -top-3 -left-3 z-10 w-[92px] -rotate-6">
        <svg viewBox="0 0 170 56" className="w-full h-auto drop-shadow-sm">
          <path
            d="M 85.00 8.00 Q 105.29 6.36 120.00 10.68 Q 140.44 12.16 145.62 18.00 Q 160.73 22.20 155.00 28.00 Q 160.73 33.80 145.62 38.00 Q 140.44 43.84 120.00 45.32 Q 105.29 49.64 85.00 48.00 Q 64.71 49.64 50.00 45.32 Q 29.56 43.84 24.38 38.00 Q 9.27 33.80 15.00 28.00 Q 9.27 22.20 24.38 18.00 Q 29.56 12.16 50.00 10.68 Q 64.71 6.36 85.00 8.00 Z"
            fill="#E1DAA9"
          />
          <text
            x="85"
            y="24"
            textAnchor="middle"
            fontSize="11"
            fontWeight="700"
            fill="#274734"
            fontFamily="var(--font-jost), sans-serif"
          >
            ✦ Sugerido
          </text>
          <text
            x="85"
            y="38"
            textAnchor="middle"
            fontSize="8.5"
            fontWeight="500"
            fill="#274734"
            fontFamily="var(--font-jost), sans-serif"
          >
            no está en tu lista
          </text>
        </svg>
      </div>

      <a
        href={product.product_url}
        target="_blank"
        className="w-full aspect-square rounded-xl bg-cream-2 flex items-center justify-center overflow-hidden mb-2.5 block"
      >
        {product.image_url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={product.image_url}
            alt={product.product_name}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-cream-2" />
        )}
      </a>

      <a href={product.product_url} target="_blank" className="block">
        <p className="font-semibold text-[0.88rem] leading-snug mb-0.5">
          {product.product_name}
        </p>
        <p className="text-[0.74rem] text-ink-soft mb-1">{product.brand_name}</p>
        {product.details && (
          <p className="text-[0.72rem] text-ink-soft/80 mb-1 leading-snug">
            {product.details}
          </p>
        )}
      </a>

      {money(product.price) ? (
        <span className="font-mono-price text-[0.78rem] font-semibold text-sage-dark bg-sage/10 px-2 py-0.5 rounded">
          {money(product.price)}
        </span>
      ) : (
        <span className="font-mono-price text-[0.78rem] text-ink-soft/70">
          Ver precio en la tienda
        </span>
      )}

      <form action={addThisItem} className="mt-2">
        <button className="w-full py-1.5 rounded-full bg-rose text-white font-semibold text-[0.78rem] hover:bg-rose-dark transition-colors">
          + Sumar a mi lista
        </button>
      </form>
    </div>
  );
}
