import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is not set in environment variables");
}

const prisma = new PrismaClient();

async function main() {
  const plainPassword = "abcd@1234!";
  const passwordHash = await bcrypt.hash(plainPassword, 10);

  await prisma.user.upsert({
    where: { email: "alice@example.com" },
    update: {},
    create: {
      email: "alice@example.com",
      firstName: "Alice",
      lastName: "Anderson",
      passwordHash,
    },
  });

  await prisma.user.upsert({
    where: { email: "bob@example.com" },
    update: {},
    create: {
      email: "bob@example.com",
      firstName: "Bob",
      lastName: "Brown",
      passwordHash,
    },
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
