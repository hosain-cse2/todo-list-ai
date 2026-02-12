import * as userRepository from "../db/repositories/user.repository";
import * as passwordUtil from "../utils/password";
import * as jwtUtil from "../utils/jwt";
import { UnauthorizedError, BadRequestError } from "../utils/errors";

export interface LoginResult {
  user: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
  };
  token: string;
}

export async function login(email: string, plainPassword: string): Promise<LoginResult> {
  if (!email || !plainPassword) {
    throw BadRequestError("Email and password are required");
  }

  const user = await userRepository.findByEmail(email.trim());
  if (!user) {
    throw UnauthorizedError("Invalid email or password");
  }

  const valid = await passwordUtil.compare(plainPassword, user.passwordHash);
  if (!valid) {
    throw UnauthorizedError("Invalid email or password");
  }

  const token = jwtUtil.sign({
    sub: user.id,
    email: user.email,
  });

  return {
    user: {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
    },
    token,
  };
}

export async function getCurrentUser(userId: string) {
  const user = await userRepository.findById(userId);
  if (!user) {
    throw UnauthorizedError("User not found");
  }
  return user;
}
