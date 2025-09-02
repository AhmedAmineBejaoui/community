import { PrismaClient } from "@prisma/client";

async function main() {
  const prisma = new PrismaClient();
  try {
    // Example no-op seed to validate DB connectivity
    await prisma.$queryRaw`db.runCommand({ ping: 1 })`;
    console.log("Seed: database reachable. No seed data inserted.");
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});

