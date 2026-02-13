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

export async function update(
  todoId: string,
  projectId: string,
  data: { text?: string; completed?: boolean },
) {
  const existing = await prisma.todo.findFirst({
    where: { id: todoId, projectId },
  });
  if (!existing) return null;

  const updateData: { text?: string; completed?: boolean } = {};
  if (data.text !== undefined) updateData.text = data.text.trim();
  if (data.completed !== undefined) updateData.completed = data.completed;

  return prisma.todo.update({
    where: { id: todoId },
    data: updateData,
  });
}
