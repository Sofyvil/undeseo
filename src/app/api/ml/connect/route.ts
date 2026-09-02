import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const secret = searchParams.get("secret");

  if (secret !== process.env.ML_SETUP_SECRET) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const redirectUri = `${process.env.NEXT_PUBLIC_SITE_URL}/api/ml/callback`;
  const authUrl = new URL("https://auth.mercadolibre.com.ar/authorization");
  authUrl.searchParams.set("response_type", "code");
  authUrl.searchParams.set("client_id", process.env.ML_CLIENT_ID!);
  authUrl.searchParams.set("redirect_uri", redirectUri);

  return NextResponse.redirect(authUrl.toString());
}
