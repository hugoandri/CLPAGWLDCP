import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const auth = request.headers.get("Authorization");
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (!adminPassword) {
    // Si no hay contraseña configurada, cualquiera puede entrar (solo local)
    return NextResponse.json({ ok: true });
  }

  if (auth !== adminPassword) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  return NextResponse.json({ ok: true });
}
