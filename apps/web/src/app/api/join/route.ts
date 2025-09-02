import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

export const runtime = "nodejs";

const joinSchema = z.object({ inviteCode: z.string().min(1) });

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession();
    if (!session?.user?.email) {
      return NextResponse.json({ error: { message: "Unauthorized" } }, { status: 401 });
    }

    const body = await request.json();
    const { inviteCode } = joinSchema.parse(body);

    // Find community by invite code
    const community = await prisma.community.findUnique({ where: { inviteCode } });
    if (!community) {
      return NextResponse.json({ error: { message: "Invalid invite code" } }, { status: 404 });
    }

    // Find current user
    const user = await prisma.user.findUnique({ where: { email: session.user.email } });
    if (!user) {
      return NextResponse.json({ error: { message: "User not found" } }, { status: 404 });
    }

    // Check existing membership
    const existing = await prisma.membership.findFirst({
      where: { userId: user.id, communityId: community.id },
    });

    if (!existing) {
      await prisma.membership.create({
        data: {
          userId: user.id,
          communityId: community.id,
          role: "RESIDENT",
        },
      });
    }

    return NextResponse.json({ community: { id: community.id, slug: community.slug } }, { status: 200 });
  } catch (error: any) {
    if (error?.name === "ZodError") {
      return NextResponse.json({ error: { message: "Invalid input", details: error.issues } }, { status: 400 });
    }
    console.error("Join community error:", error);
    return NextResponse.json({ error: { message: "Internal server error" } }, { status: 500 });
  }
}

