import { Request, Response, NextFunction } from "express";
import * as jwtUtil from "../utils/jwt";
import { UnauthorizedError } from "../utils/errors";

export interface AuthRequest extends Request {
  user?: jwtUtil.JwtPayload;
}

export function requireAuth(req: AuthRequest, _res: Response, next: NextFunction): void {
  const authHeader = req.headers.authorization;
  const token = authHeader?.startsWith("Bearer ") ? authHeader.slice(7) : null;

  if (!token) {
    return next(UnauthorizedError("Token required"));
  }

  try {
    const payload = jwtUtil.verify(token);
    req.user = payload;
    next();
  } catch {
    next(UnauthorizedError("Invalid or expired token"));
  }
}
