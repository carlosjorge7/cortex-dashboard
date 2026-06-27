import { jwtVerify } from "jose";
import { NextRequest, NextResponse } from "next/server";

const PUBLIC = ["/cortex/login"];
const SECRET = new TextEncoder().encode(process.env.JWT_SECRET ?? "");

export async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (PUBLIC.some((p) => pathname.startsWith(p))) return NextResponse.next();

  const token = req.cookies.get("cortex_token")?.value;
  if (!token) return NextResponse.redirect(new URL("/cortex/login", req.url));

  try {
    await jwtVerify(token, SECRET);
  } catch {
    const res = NextResponse.redirect(new URL("/cortex/login", req.url));
    res.cookies.delete("cortex_token");
    return res;
  }

  // Forward the JWT to FastAPI via the api-proxy rewrite
  const headers = new Headers(req.headers);
  headers.set("Authorization", `Bearer ${token}`);
  return NextResponse.next({ request: { headers } });
}

export const config = {
  matcher: ["/cortex/:path*"],
};
