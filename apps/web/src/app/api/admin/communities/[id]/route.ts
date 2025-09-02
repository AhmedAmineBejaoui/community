import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

export const runtime = "nodejs";

export async function GET(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession();
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({ where: { email: session.user.email } });
    if (!user || (user.role !== "ADMIN" && user.role !== "SUPER_ADMIN")) {
      return NextResponse.json({ error: "Insufficient permissions" }, { status: 403 });
    }

    const community = await prisma.community.findUnique({ where: { id: params.id } });
    if (!community) {
      return NextResponse.json({ error: "Community not found" }, { status: 404 });
    }

    return NextResponse.json({
      community: {
        id: community.id,
        name: community.name,
        slug: community.slug,
        description: community.description ?? "",
        joinPolicy: community.joinPolicy,
        inviteCode: community.inviteCode ?? undefined,
        createdAt: community.createdAt,
        extra: (community as any).extra ?? undefined,
      },
    });
  } catch (error) {
    console.error("Error fetching admin community:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

const updateSchema = z.object({
  name: z.string().min(3).max(50).optional(),
  slug: z.string().min(3).max(30).regex(/^[a-z0-9-]+$/).optional(),
  description: z.string().max(500).optional().nullable(),
  joinPolicy: z.enum(["INVITE_ONLY", "REQUEST_APPROVAL", "CODE"]).optional(),
  inviteCode: z.string().optional().nullable(),
});

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession();
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const user = await prisma.user.findUnique({ where: { email: session.user.email } });
    if (!user || (user.role !== "ADMIN" && user.role !== "SUPER_ADMIN")) {
      return NextResponse.json({ error: "Insufficient permissions" }, { status: 403 });
    }

    const body = await request.json();
    const parsed = updateSchema.parse(body);

    // Build Prisma update object only with present fields
    const data: any = {};
    if (parsed.name !== undefined) data.name = { set: parsed.name };
    if (parsed.slug !== undefined) data.slug = { set: parsed.slug };
    if (parsed.description !== undefined) data.description = { set: parsed.description };
    if (parsed.joinPolicy !== undefined) data.joinPolicy = { set: parsed.joinPolicy };
    if (parsed.inviteCode !== undefined) data.inviteCode = { set: parsed.inviteCode };

    const updated = await prisma.community.update({ where: { id: params.id }, data });
    return NextResponse.json({ community: updated });
  } catch (error: any) {
    if (error?.name === "ZodError") {
      return NextResponse.json({ error: error.issues }, { status: 400 });
    }
    if (error?.code === "P2025") {
      return NextResponse.json({ error: "Community not found" }, { status: 404 });
    }
    console.error("Error updating community:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession();
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const user = await prisma.user.findUnique({ where: { email: session.user.email } });
    if (!user || (user.role !== "ADMIN" && user.role !== "SUPER_ADMIN")) {
      return NextResponse.json({ error: "Insufficient permissions" }, { status: 403 });
    }

    // Ensure the community exists
    const existing = await prisma.community.findUnique({ where: { id: params.id } });
    if (!existing) {
      return NextResponse.json({ error: "Community not found" }, { status: 404 });
    }

    // Manual cascade: remove child records tied to this community first
    await prisma.$transaction([
      prisma.membership.deleteMany({ where: { communityId: params.id } }),
      prisma.post.deleteMany({ where: { communityId: params.id } }),
      prisma.chatSession.deleteMany({ where: { communityId: params.id } }),
      prisma.community.delete({ where: { id: params.id } }),
    ]);

    return NextResponse.json({ ok: true });
  } catch (error: any) {
    if (error?.code === "P2025") {
      return NextResponse.json({ error: "Community not found" }, { status: 404 });
    }
    console.error("Error deleting community:", error);
    return NextResponse.json({ error: error?.message || "Internal server error" }, { status: 500 });
  }
}
