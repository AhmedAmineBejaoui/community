import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { updateTaskSchema } from "../schemas";

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  const item = await prisma.task.findUnique({ where: { id: params.id } });
  if (!item) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ data: item });
}

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await req.json();
    const data = updateTaskSchema.parse(body);
    const updated = await prisma.task.update({ where: { id: params.id }, data });
    return NextResponse.json({ data: updated });
  } catch (e) {
    if (e?.code === 'P2025') return NextResponse.json({ error: "Not found" }, { status: 404 });
    if (e?.name === 'ZodError') return NextResponse.json({ error: e.issues }, { status: 400 });
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await prisma.task.delete({ where: { id: params.id } });
    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
}
