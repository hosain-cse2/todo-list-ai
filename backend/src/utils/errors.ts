export interface AppError extends Error {
  statusCode: number;
}

function makeError(message: string, statusCode: number, name: string): AppError {
  const err = new Error(message) as AppError;
  err.statusCode = statusCode;
  err.name = name;
  return err;
}

export function UnauthorizedError(message = "Unauthorized"): AppError {
  return makeError(message, 401, "UnauthorizedError");
}

export function BadRequestError(message = "Bad request"): AppError {
  return makeError(message, 400, "BadRequestError");
}

export function NotFoundError(message = "Not found"): AppError {
  return makeError(message, 404, "NotFoundError");
}
