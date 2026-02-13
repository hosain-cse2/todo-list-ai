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

export async function update(
  id: string,
  userId: string,
  data: { name?: string; description?: string },
) {
  const project = await findById(id, userId);
  if (!project) return null;

  return prisma.project.update({
    where: { id },
    data: {
      ...(data.name !== undefined && { name: data.name.trim() }),
      ...(data.description !== undefined && { description: data.description.trim() }),
    },
    include: {
      todos: { orderBy: { createdAt: "desc" } },
    },
  });
}

export async function deleteById(id: string, userId: string) {
  return prisma.project.deleteMany({
    where: { id, userId },
  });
}
