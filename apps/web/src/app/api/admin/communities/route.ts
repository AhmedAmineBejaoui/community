import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const createCommunitySchema = z.object({
  name: z.string().min(3).max(50),
  slug: z.string().min(3).max(30).regex(/^[a-z0-9-]+$/),
  description: z.string().min(10).max(500),
  joinPolicy: z.enum(['INVITE_ONLY', 'REQUEST_APPROVAL', 'CODE']),
  inviteCode: z.string().optional(),
  isPublic: z.boolean().default(true),
  allowPosts: z.boolean().default(true),
  allowComments: z.boolean().default(true),
  allowPolls: z.boolean().default(true),
  allowServices: z.boolean().default(true),
  allowMarketplace: z.boolean().default(true),
});

export async function GET(request: NextRequest) {
  try {
    // Check if user is authenticated and is admin
    const session = await getServerSession();
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get the current user to check their role
    const currentUser = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!currentUser || (currentUser.role !== "ADMIN" && currentUser.role !== "SUPER_ADMIN")) {
      return NextResponse.json({ error: "Insufficient permissions" }, { status: 403 });
    }

    // Fetch all communities with their member and post counts
    const communities = await prisma.community.findMany({
      select: {
        id: true,
        name: true,
        slug: true,
        createdAt: true,
        _count: {
          select: {
            memberships: true,
            posts: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    return NextResponse.json({
      data: communities,
      total: communities.length
    });
  } catch (error) {
    console.error("Error fetching communities:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    console.log("=== Community Creation API Called ===");
    
    // Check if user is authenticated and is admin
    const session = await getServerSession();
    console.log("Session:", session);
    
    if (!session?.user?.email) {
      console.log("No session or user email");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get the current user to check their role
    const currentUser = await prisma.user.findUnique({
      where: { email: session.user.email },
    });
    console.log("Current user:", currentUser);

    if (!currentUser || (currentUser.role !== "ADMIN" && currentUser.role !== "SUPER_ADMIN")) {
      console.log("Insufficient permissions for user:", currentUser?.role);
      return NextResponse.json({ error: "Insufficient permissions" }, { status: 403 });
    }

    const body = await request.json();
    console.log("Request body:", body);
    
    const validatedData = createCommunitySchema.parse(body);
    console.log("Validated data:", validatedData);

    // Check if slug already exists
    const existingCommunity = await prisma.community.findUnique({
      where: { slug: validatedData.slug },
    });

    if (existingCommunity) {
      console.log("Slug already exists:", validatedData.slug);
      return NextResponse.json(
        { error: "Une communauté avec cet identifiant existe déjà" },
        { status: 400 }
      );
    }

    console.log("Creating community...");
    // Create the community
    const community = await prisma.community.create({
      data: {
        name: validatedData.name,
        slug: validatedData.slug,
        description: validatedData.description,
        joinPolicy: validatedData.joinPolicy,
        inviteCode: validatedData.inviteCode,
      },
    });
    console.log("Community created:", community);

    console.log("Creating membership...");
    // Add the creator as admin member
    await prisma.membership.create({
      data: {
        userId: currentUser.id,
        communityId: community.id,
        role: 'ADMIN',
      },
    });
    console.log("Membership created successfully");

    return NextResponse.json({
      message: "Communauté créée avec succès",
      community: {
        id: community.id,
        name: community.name,
        slug: community.slug,
        description: community.description,
        joinPolicy: community.joinPolicy,
        inviteCode: community.inviteCode,
        createdAt: community.createdAt,
      },
    }, { status: 201 });

  } catch (error) {
    console.error("=== ERROR IN COMMUNITY CREATION ===");
    console.error("Error type:", error.constructor.name);
    console.error("Error message:", error.message);
    console.error("Error stack:", error.stack);
    
    if (error instanceof z.ZodError) {
      console.error("Zod validation error:", error.errors);
      return NextResponse.json(
        { error: "Données invalides", details: error.errors },
        { status: 400 }
      );
    }

    console.error("Error creating community:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
