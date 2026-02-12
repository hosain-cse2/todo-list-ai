import { Request, Response, NextFunction } from "express";
import config from "../config";
import type { AppError } from "../utils/errors";

export function errorHandler(
  err: AppError | Error,
  _req: Request,
  res: Response,
  _next: NextFunction
): void {
  const statusCode = "statusCode" in err ? err.statusCode : 500;
  const message = "statusCode" in err ? err.message : "Internal server error";

  if (statusCode === 500 && config.nodeEnv === "development") {
    console.error(err);
  }

  res.status(statusCode).json({
    error: message,
    ...(config.nodeEnv === "development" && err.stack && { stack: err.stack }),
  });
}
