import Link from "next/link";

export const metadata = {
  title: "Términos y Condiciones — Un Deseo",
};

export default function TerminosPage() {
  return (
    <main className="max-w-lg md:max-w-2xl mx-auto w-full px-5 md:px-8 py-10">
      <Link href="/" className="text-sage-dark text-[0.85rem] font-semibold">
        ← Volver al inicio
      </Link>

      <h1 className="font-display text-3xl font-bold mt-4 mb-6">
        Términos y Condiciones
      </h1>

      <div className="flex flex-col gap-4 text-[0.92rem] text-ink-soft leading-relaxed">
        <p>
          &quot;Un Deseo&quot; es una herramienta para armar y compartir listas de
          regalos. Al usarla, aceptás lo siguiente:
        </p>

        <div>
          <p className="font-semibold text-ink mb-1">
            &quot;Un Deseo&quot; no es una tienda
          </p>
          <p>
            &quot;Un Deseo&quot; no vende productos, no gestiona pagos, no maneja stock
            ni envíos. Solo agrupa, en un solo lugar, links a productos que
            se encuentran publicados en tiendas de terceros (Mercado Libre,
            tiendas online, u otras).
          </p>
        </div>

        <div>
          <p className="font-semibold text-ink mb-1">
            La compra se hace en la tienda original
          </p>
          <p>
            Reservar un regalo en &quot;Un Deseo&quot; no equivale a comprarlo. Quien
            regala debe ingresar al link de la tienda correspondiente y
            completar la compra ahí. El precio, la disponibilidad de stock,
            los tiempos de envío y cualquier otra condición de venta
            dependen exclusivamente de esa tienda, no de &quot;Un Deseo&quot;.
          </p>
        </div>

        <div>
          <p className="font-semibold text-ink mb-1">
            No nos responsabilizamos por terceros
          </p>
          <p>
            Los precios y datos de los productos pueden cambiar en cualquier
            momento en la tienda original, sin que &quot;Un Deseo&quot; pueda
            garantizar que la información mostrada esté siempre
            actualizada. &quot;Un Deseo&quot; no se responsabiliza por problemas de
            precio, stock, calidad, envío o postventa de productos comprados
            en tiendas de terceros.
          </p>
        </div>

        <div>
          <p className="font-semibold text-ink mb-1">Datos que guardamos</p>
          <p>
            Guardamos el mail de quien crea una lista únicamente para poder
            devolverle el acceso si pierde su link. No lo compartimos con
            terceros ni lo usamos con otro fin.
          </p>
        </div>

        <p className="text-[0.8rem] pt-2 border-t border-line mt-2">
          Este texto es una referencia general y no reemplaza asesoramiento
          legal profesional.
        </p>
      </div>
    </main>
  );
}
