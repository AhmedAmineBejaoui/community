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
            include: {
              community: {
                include: {
                  memberships: true
                }
              }
            }
          }
        }
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const communities = user.memberships.map((membership: any) => ({
      id: membership.community.id,
      name: membership.community.name,
      slug: membership.community.slug,
      description: "", // Not available in schema
      memberCount: membership.community.memberships.length,
      role: membership.role
    }));

    return NextResponse.json(communities);
  } catch (error) {
    console.error("Error fetching user communities:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
