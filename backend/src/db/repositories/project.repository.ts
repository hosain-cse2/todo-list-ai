import { prisma } from "../client";

export async function create(
  userId: string,
  name: string,
  description: string,
) {
  return prisma.project.create({
    data: { userId, name, description },
    include: {
      todos: { orderBy: { createdAt: "desc" } },
    },
  });
}

export async function findManyByUserId(userId: string) {
  return prisma.project.findMany({
    where: { userId },
    include: {
      todos: { orderBy: { createdAt: "desc" } },
    },
    orderBy: { createdAt: "desc" },
  });
}

export async function findById(id: string, userId?: string) {
  return prisma.project.findFirst({
    where: { id, ...(userId ? { userId } : {}) },
    include: {
      todos: { orderBy: { createdAt: "desc" } },
    },
  });
}
