import type { Response } from "express";
import type { AuthRequest } from "../middleware/auth.middleware";
import * as projectRepository from "../db/repositories/project.repository";

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

