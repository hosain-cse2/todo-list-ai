import { prisma } from "../client";

export async function create(projectId: string, text: string) {
  return prisma.todo.create({
    data: { projectId, text: text.trim() },
  });
}

export async function deleteById(todoId: string, projectId: string) {
  return prisma.todo.deleteMany({
    where: { id: todoId, projectId },
  });
}
