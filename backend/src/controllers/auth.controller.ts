import { Request, Response, NextFunction } from "express";
import * as authService from "../services/auth.service";

export async function login(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { email, password } = req.body as { email?: string; password?: string };
    const { user, token } = await authService.login(email ?? "", password ?? "");

    // Set access token as HttpOnly cookie for security, only return user to client
    res
      .cookie("accessToken", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
      })
      .status(200)
      .json({ user });
  } catch (err) {
    next(err);
  }
}
