import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { current_password, new_password } = await req.json();

  const cookieStore = await cookies();
  const token = cookieStore.get("cortex_token")?.value;
  if (!token) return NextResponse.json({ error: "No autenticado" }, { status: 401 });

  const api = await fetch("http://localhost:8000/auth/change-password", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ current_password, new_password }),
  });

  if (!api.ok) {
    const err = await api.json().catch(() => ({ detail: "Error desconocido" }));
    return NextResponse.json({ error: err.detail }, { status: api.status });
  }

  return NextResponse.json({ ok: true });
}
