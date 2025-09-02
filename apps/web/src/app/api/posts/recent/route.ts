import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession();
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: {
        memberships: {
          select: { communityId: true }
        }
      }
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const userCommunityIds = user.memberships.map((m: any) => m.communityId);

    if (userCommunityIds.length === 0) {
      return NextResponse.json([]);
    }

    const recentPosts = await prisma.post.findMany({
      where: {
        communityId: { in: userCommunityIds }
      },
      include: {
        community: {
          select: {
            name: true,
            slug: true
          }
        },
        author: {
          select: {
            fullName: true
          }
        }
      },
      orderBy: {
        createdAt: "desc"
      },
      take: 10
    });

    const formattedPosts = recentPosts.map((post: any) => ({
      id: post.id,
      title: post.title,
      content: post.content,
      type: post.type,
      community: {
        name: post.community.name,
        slug: post.community.slug
      },
      author: post.author.fullName,
      createdAt: post.createdAt.toISOString()
    }));

    return NextResponse.json(formattedPosts);
  } catch (error) {
    console.error("Error fetching recent posts:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
