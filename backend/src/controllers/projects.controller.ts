import type { Response } from "express";
import type { AuthRequest } from "../middleware/auth.middleware";
import * as projectRepository from "../db/repositories/project.repository";
import * as todoRepository from "../db/repositories/todo.repository";

export async function list(req: AuthRequest, res: Response): Promise<void> {
  const userId = req.user!.sub;
  const projects = await projectRepository.findManyByUserId(userId);
  res.json({ projects });
}

export async function getById(req: AuthRequest, res: Response): Promise<void> {
  const { id } = req.params;
  const userId = req.user!.sub;
  const project = await projectRepository.findById(id, userId);

  if (!project) {
    res.status(404).json({ message: "Project not found" });
    return;
  }

  res.json({ project });
}

export async function create(req: AuthRequest, res: Response): Promise<void> {
  const userId = req.user!.sub;
  const { name, description } = req.body as { name: string; description?: string };
  const project = await projectRepository.create(
    userId,
    name.trim(),
    (description ?? "").trim(),
  );
  res.status(201).json({ project });
}

export async function createTodo(req: AuthRequest, res: Response): Promise<void> {
  const { id: projectId } = req.params;
  const userId = req.user!.sub;
  const { text } = req.body as { text: string };

  const project = await projectRepository.findById(projectId, userId);
  if (!project) {
    res.status(404).json({ message: "Project not found" });
    return;
  }

  const todo = await todoRepository.create(project.id, text);
  res.status(201).json({ todo });
}

export async function deleteTodo(req: AuthRequest, res: Response): Promise<void> {
  const { id: projectId, todoId } = req.params;
  const userId = req.user!.sub;

  const project = await projectRepository.findById(projectId, userId);
  if (!project) {
    res.status(404).json({ message: "Project not found" });
    return;
  }

  const result = await todoRepository.deleteById(todoId, project.id);
  if (result.count === 0) {
    res.status(404).json({ message: "Todo not found" });
    return;
  }

  res.status(204).send();
}

export async function updateTodo(req: AuthRequest, res: Response): Promise<void> {
  const { id: projectId, todoId } = req.params;
  const userId = req.user!.sub;
  const { text, completed } = req.body as { text?: string; completed?: boolean };

  const project = await projectRepository.findById(projectId, userId);
  if (!project) {
    res.status(404).json({ message: "Project not found" });
    return;
  }

  const todo = await todoRepository.update(todoId, project.id, {
    ...(text !== undefined && { text }),
    ...(completed !== undefined && { completed }),
  });

  if (!todo) {
    res.status(404).json({ message: "Todo not found" });
    return;
  }

  res.json({ todo });
}

export async function update(req: AuthRequest, res: Response): Promise<void> {
  const { id } = req.params;
  const userId = req.user!.sub;
  const { name, description } = req.body as { name?: string; description?: string };

  if (name === undefined && description === undefined) {
    res.status(400).json({ message: "Provide name and/or description to update" });
    return;
  }

  const project = await projectRepository.update(id, userId, {
    ...(name !== undefined && { name }),
    ...(description !== undefined && { description }),
  });

  if (!project) {
    res.status(404).json({ message: "Project not found" });
    return;
  }

  res.json({ project });
}

export async function remove(req: AuthRequest, res: Response): Promise<void> {
  const { id } = req.params;
  const userId = req.user!.sub;

  const result = await projectRepository.deleteById(id, userId);
  if (result.count === 0) {
    res.status(404).json({ message: "Project not found" });
    return;
  }

  res.status(204).send();
}

