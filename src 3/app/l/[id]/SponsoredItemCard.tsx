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
      {/* Sticker ondulado tipo nube, superpuesto en la esquina */}
      <div className="absolute -top-6 -left-6 z-10 w-[128px] -rotate-6">
        <svg viewBox="0 0 170 156" className="w-full h-auto drop-shadow-md">
          <path
            d="M 85.00 16.00 Q 107.62 9.13 123.00 24.31 Q 146.80 27.58 150.82 47.00 Q 169.42 59.55 161.00 78.00 Q 169.42 96.45 150.82 109.00 Q 146.80 128.42 123.00 131.69 Q 107.62 146.87 85.00 140.00 Q 62.38 146.87 47.00 131.69 Q 23.20 128.42 19.18 109.00 Q 0.58 96.45 9.00 78.00 Q 0.58 59.55 19.18 47.00 Q 23.20 27.58 47.00 24.31 Q 62.38 9.13 85.00 16.00 Z"
            fill="#ECE192"
          />
          <text
            x="85"
            y="70"
            textAnchor="middle"
            fontSize="20"
            fontWeight="700"
            fill="#274734"
            fontFamily="var(--font-jost), sans-serif"
          >
            ✦ Sugerido
          </text>
          <text
            x="85"
            y="92"
            textAnchor="middle"
            fontSize="13"
            fontWeight="600"
            fill="#274734"
            fontFamily="var(--font-jost), sans-serif"
          >
            no está
          </text>
          <text
            x="85"
            y="108"
            textAnchor="middle"
            fontSize="13"
            fontWeight="600"
            fill="#274734"
            fontFamily="var(--font-jost), sans-serif"
          >
            en tu lista
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
