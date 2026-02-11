import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is not set in environment variables");
}

// Use default PrismaClient options; it will read DATABASE_URL from env
const prisma = new PrismaClient();

async function main() {
  // Raw password visible in this file
  const plainPassword = "abcd@1234!";

  // Hash the password once, reuse for both users
  const passwordHash = await bcrypt.hash(plainPassword, 10);

  await prisma.user.upsert({
    where: { email: "alice@example.com" },
    update: {},
    create: {
      email: "alice@example.com",
      firstName: "Alice",
      lastName: "Anderson",
      passwordHash, // stored as hash
    },
  });

  await prisma.user.upsert({
    where: { email: "bob@example.com" },
    update: {},
    create: {
      email: "bob@example.com",
      firstName: "Bob",
      lastName: "Brown",
      passwordHash, // same raw password, same hash
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
