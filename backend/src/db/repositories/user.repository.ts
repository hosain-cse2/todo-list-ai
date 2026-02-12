import { prisma } from "../client";
import type { User } from "@prisma/client";

export async function findByEmail(email: string): Promise<User | null> {
  return prisma.user.findUnique({
    where: { email },
  });
}

export async function findById(
  id: string
): Promise<Pick<User, "id" | "email" | "firstName" | "lastName" | "createdAt"> | null> {
  return prisma.user.findUnique({
    where: { id },
    select: {
      id: true,
      email: true,
      firstName: true,
      lastName: true,
      createdAt: true,
    },
  });
}
