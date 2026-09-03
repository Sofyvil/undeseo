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
      {/* Sticker ondulado tipo nube (fila de círculos), superpuesto en la esquina */}
      <div className="absolute -top-5 -left-5 z-10 w-[164px] -rotate-6">
        <svg viewBox="0 0 230 124" className="w-full h-auto drop-shadow-md">
          <g fill="#ECE192">
            <circle cx="46" cy="62" r="46" />
            <circle cx="92" cy="62" r="46" />
            <circle cx="138" cy="62" r="46" />
            <circle cx="184" cy="62" r="46" />
          </g>
          <text
            x="115"
            y="56"
            textAnchor="middle"
            fontSize="19"
            fontWeight="700"
            fill="#274734"
            fontFamily="var(--font-jost), sans-serif"
          >
            ✦ Sugerido
          </text>
          <text
            x="115"
            y="78"
            textAnchor="middle"
            fontSize="13"
            fontWeight="600"
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
