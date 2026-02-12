import jwt from "jsonwebtoken";
import config from "../config";

export interface JwtPayload {
  sub: string;
  email: string;
}

export function sign(payload: JwtPayload): string {
  return jwt.sign(
    payload,
    config.jwt.secret,
    { expiresIn: config.jwt.expiresIn } as jwt.SignOptions
  );
}

export function verify(token: string): JwtPayload {
  return jwt.verify(token, config.jwt.secret) as JwtPayload;
}
