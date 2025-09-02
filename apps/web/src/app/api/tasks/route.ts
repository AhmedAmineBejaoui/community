import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { createTaskSchema } from "./schemas";

export async function GET(request: NextRequest) {
  try {
    const items = await prisma.task.findMany({ orderBy: { createdAt: 'desc' } });
    return NextResponse.json({ data: items });
  } catch (e) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const data = createTaskSchema.parse(body);
    const created = await prisma.task.create({ data });
    return NextResponse.json({ data: created }, { status: 201 });
  } catch (e) {
    if (e?.name === 'ZodError') return NextResponse.json({ error: e.issues }, { status: 400 });
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
