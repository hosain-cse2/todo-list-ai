import { Request, Response, NextFunction } from "express";
import type { Schema } from "joi";
import { BadRequestError } from "../utils/errors";

export function validate(schema: Schema) {
  return (req: Request, _res: Response, next: NextFunction): void => {
    const { error, value } = schema.validate(req.body, { abortEarly: false });
    if (error) {
      const message = error.details.map((d) => d.message).join("; ");
      return next(BadRequestError(message));
    }
    req.body = value;
    next();
  };
}
