import { Request, Response } from "express";

export function get(_req: Request, res: Response): void {
  res.json({ ok: true, time: new Date().toISOString() });
}
