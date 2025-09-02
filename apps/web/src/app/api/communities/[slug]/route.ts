import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const { slug } = params;

    const community = await prisma.community.findUnique({
      where: { slug },
      include: {
        _count: {
          select: {
            memberships: true,
            posts: true,
          },
        },
      },
    });

    if (!community) {
      return NextResponse.json(
        { error: "Community not found" },
        { status: 404 }
      );
    }

    // Shape response to match consumer page expectations: community._count.members/posts
    return NextResponse.json({
      data: {
        id: community.id,
        name: community.name,
        slug: community.slug,
        description: community.description || "",
        _count: {
          members: community._count.memberships,
          posts: community._count.posts,
        },
        joinPolicy: community.joinPolicy,
        createdAt: community.createdAt.toISOString(),
      },
    });
  } catch (error) {
    console.error("Error fetching community:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
