import type { Request, Response } from "express";
import { projects } from "../data/projects";

export function list(_req: Request, res: Response): void {
  // For now, return all projects with their todos (mock data)
  res.json({ projects });
}

export function getById(req: Request, res: Response): void {
  const { id } = req.params;
  const project = projects.find((p) => p.id === id);

  if (!project) {
    res.status(404).json({ message: "Project not found" });
    return;
  }

  res.json({ project });
}

export function create(req: Request, res: Response): void {
  // Creation not implemented yet – just echo back for now
  res.status(501).json({
    message: "Project creation not yet implemented",
    data: req.body,
  });
}

