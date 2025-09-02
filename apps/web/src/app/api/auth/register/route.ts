import { NextRequest, NextResponse } from "next/server";
import { hash } from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import { z } from "zod";

// Ensure this route runs on the Node.js runtime (Prisma isn't supported on Edge).
export const runtime = "nodejs";

const registerSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(6),
});

export async function POST(request: NextRequest) {
  try {
    // Quick sanity check for required env
    if (!process.env.MONGO_URI) {
      return NextResponse.json(
        { error: "Server misconfiguration: MONGO_URI is not set" },
        { status: 500 }
      );
    }

    const body = await request.json();
    const { name, email, password } = registerSchema.parse(body);

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "User with this email already exists" },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await hash(password, 12);

    // Check if this is the first user (make them admin)
    const userCount = await prisma.user.count();
    const isFirstUser = userCount === 0;

    // Create user
    const user = await prisma.user.create({
      data: {
        fullName: name,
        email,
        passwordHash: hashedPassword,
        status: "ACTIVE",
        role: isFirstUser ? "ADMIN" : "USER", // First user becomes admin
      },
    });

    // Remove password from response
    const { passwordHash: _, ...userWithoutPassword } = user;

    return NextResponse.json(
      { message: "User created successfully", user: userWithoutPassword },
      { status: 201 }
    );
  } catch (error: unknown) {
    // Validation errors
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid input data", details: error.errors },
        { status: 400 }
      );
    }

    // Prisma known request error (e.g., unique constraint)
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2002") {
        return NextResponse.json(
          { error: "A user with this email already exists" },
          { status: 400 }
        );
      }
      if (error.code === "P2031") {
        return NextResponse.json(
          {
            error:
              "Database requires a MongoDB replica set for transactions. Start MongoDB with --replSet rs0 or use the provided Docker setup.",
          },
          { status: 500 }
        );
      }
    }

    // Initialization/connection issues
    if (
      error &&
      typeof error === "object" &&
      "name" in error &&
      (error as any).name === "PrismaClientInitializationError"
    ) {
      return NextResponse.json(
        { error: "Database connection failed. Is MongoDB running?" },
        { status: 503 }
      );
    }

    console.error("Registration error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
