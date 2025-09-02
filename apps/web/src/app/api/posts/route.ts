import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { z } from "zod";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');
    const communityId = searchParams.get('communityId');
    const priority = searchParams.get('priority');
    const status = searchParams.get('status');
    const limit = Math.min(parseInt(searchParams.get('limit') || '20'), 50); // Limite stricte à 50

    const where: any = {};

    if (type) where.type = type;
    if (communityId) {
      const isObjectId = /^[a-f\d]{24}$/i.test(communityId);
      if (isObjectId) where.communityId = communityId;
      else where.community = { is: { slug: communityId } };
    }
    if (priority) where.extra = { path: ['priority'], equals: priority };
    if (status) where.extra = { path: ['status'], equals: status };

    const posts = await prisma.post.findMany({
      where,
      select: {
        id: true,
        title: true,
        content: true,
        type: true,
        images: true,
        extra: true,
        createdAt: true,
        community: { select: { name: true, slug: true } },
        author: { select: { fullName: true } }
      },
      orderBy: { createdAt: 'desc' },
      take: limit
    });

    const formattedPosts = posts.map((post: any) => ({
      id: post.id,
      title: post.title,
      content: post.content,
      type: post.type,
      community: {
        name: post.community.name,
        slug: post.community.slug
      },
      author: { fullName: post.author.fullName },
      images: post.images ?? [],
      extra: post.extra ?? null,
      createdAt: post.createdAt.toISOString()
    }));

    return NextResponse.json({
      data: formattedPosts,
      paging: {
        hasMore: posts.length === limit,
        total: formattedPosts.length
      }
    });
  } catch (error) {
    console.error("Error fetching posts:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

const createPostSchema = z.object({
  communityId: z.string().min(1),
  title: z.string().min(1),
  content: z.string().optional().default(""),
  type: z.enum(["ANNOUNCEMENT", "SERVICE", "LISTING", "POLL"]),
  images: z.array(z.string()).default([]),
  extra: z.record(z.any()).optional(),
});

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession();
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({ where: { email: session.user.email } });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const body = await request.json();
    const data = createPostSchema.parse(body);

    // Ensure community exists
    const community = await prisma.community.findUnique({ where: { id: data.communityId } });
    if (!community) {
      return NextResponse.json({ error: "Community not found" }, { status: 404 });
    }

    const created = await prisma.post.create({
      data: {
        communityId: data.communityId,
        authorId: user.id,
        type: data.type,
        title: data.title,
        content: data.content ?? null,
        images: data.images ?? [],
        extra: data.extra !== undefined ? data.extra : null,
      },
      select: { id: true },
    });

    return NextResponse.json({ data: { id: created.id } }, { status: 201 });
  } catch (error: any) {
    if (error?.name === "ZodError") {
      return NextResponse.json({ error: { message: "Invalid input", details: error.issues } }, { status: 400 });
    }
    console.error("Error creating post:", error);
    return NextResponse.json({ error: { message: "Internal server error" } }, { status: 500 });
  }
}
