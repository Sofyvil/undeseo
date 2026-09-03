import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { redirect } from "next/navigation";
import { AddSponsoredProductForm } from "./AddSponsoredProductForm";
import { SponsoredProductsList } from "./ProductsList";

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

      <AddSponsoredProductForm />

      <SponsoredProductsList products={products ?? []} />
    </main>
  );
}
