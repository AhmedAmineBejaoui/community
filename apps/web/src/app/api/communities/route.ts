import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '50');

    const communities = await prisma.community.findMany({
      include: {
        _count: {
          select: {
            memberships: true,
            posts: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      },
      take: limit
    });

    const formattedCommunities = communities.map((community: any) => ({
      id: community.id,
      name: community.name,
      slug: community.slug,
      description: community.description || "",
      memberCount: community._count.memberships,
      postCount: community._count.posts,
      joinPolicy: community.joinPolicy,
      createdAt: community.createdAt.toISOString()
    }));

    return NextResponse.json({
      data: formattedCommunities,
      paging: {
        hasMore: communities.length === limit,
        total: communities.length
      }
    });
  } catch (error) {
    console.error("Error fetching communities:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
