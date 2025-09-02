import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export const runtime = "nodejs";

function apiBase() {
  const base = process.env.API_BASE_URL || (process.env.API_PORT ? `http://localhost:${process.env.API_PORT}` : "http://localhost:4000");
  return base.replace(/\/$/, "");
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const tokenParams: any = { req, raw: true };
    if (process.env.NEXTAUTH_SECRET !== undefined) {
      tokenParams.secret = process.env.NEXTAUTH_SECRET;
    }
    const raw = await getToken(tokenParams);
    if (!raw) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const res = await fetch(`${apiBase()}/api/v1/chat/messages`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${raw}` },
      body: JSON.stringify(body),
    });
    const data = await res.json().catch(() => ({}));
    return NextResponse.json(data, { status: res.status });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || "Internal error" }, { status: 500 });
  }
}

