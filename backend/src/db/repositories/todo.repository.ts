import { prisma } from "../client";

// PrismaClient from @prisma/client can miss the `todo` model until prisma generate is run.
// Cast so TypeScript accepts prisma.todo (runtime is correct when schema has Todo).
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const db = prisma as any;

export async function create(projectId: string, text: string) {
  return db.todo.create({
    data: { projectId, text: text.trim() },
  });
}

export async function deleteById(todoId: string, projectId: string) {
  return db.todo.deleteMany({
    where: { id: todoId, projectId },
  });
}

export async function update(
  todoId: string,
  projectId: string,
  data: { text?: string; completed?: boolean },
) {
  const existing = await db.todo.findFirst({
    where: { id: todoId, projectId },
  });
  if (!existing) return null;

  const updateData: { text?: string; completed?: boolean } = {};
  if (data.text !== undefined) updateData.text = data.text.trim();
  if (data.completed !== undefined) updateData.completed = data.completed;

  return db.todo.update({
    where: { id: todoId },
    data: updateData,
  });
}
