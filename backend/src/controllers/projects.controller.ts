import { Request, Response } from "express";

export function list(_req: Request, res: Response): void {
  res.json({ projects: [] });
}

export function create(req: Request, res: Response): void {
  res.status(501).json({
    message: "Project creation not yet implemented",
    data: req.body,
  });
}
