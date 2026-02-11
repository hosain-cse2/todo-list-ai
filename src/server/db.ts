import { PrismaClient } from "@prisma/client";
import { env } from "@/src/lib/env";

declare global {
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined;
}

let prisma: PrismaClient;

if (process.env.NODE_ENV === "production") {
  prisma = new PrismaClient({
    datasources: { db: { url: env.DATABASE_URL } },
  });
} else {
  if (!global.prisma) {
    global.prisma = new PrismaClient({
      datasources: { db: { url: env.DATABASE_URL } },
    });
  }
  prisma = global.prisma;
}

export async function getDbClient() {
  return prisma;
}

