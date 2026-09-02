import { NextResponse } from "next/server";
import { exchangeCodeForTokens } from "@/lib/mercadolibre";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");

  if (!code) {
    return NextResponse.json({ error: "Falta el código de Mercado Libre" }, { status: 400 });
  }

  try {
    const redirectUri = `${origin}/api/ml/callback`;
    await exchangeCodeForTokens(code, redirectUri);
    return new NextResponse(
      "<h1>✅ Conectado con Mercado Libre</h1><p>Ya podés cerrar esta pestaña.</p>",
      { headers: { "Content-Type": "text/html; charset=utf-8" } }
    );
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Error desconocido" },
      { status: 500 }
    );
  }
}
