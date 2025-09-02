import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV !== "production" ? ["query", "error", "warn"] : ["error"],
    datasources: {
      db: { url: process.env.MONGO_URI ?? "" },
    },
    // Ajout pour accélérer les connexions en prod
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
