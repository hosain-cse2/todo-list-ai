import { apiFetch } from "@/lib/fetcher";

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000";

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
}

export interface LoginResponse {
  user: User;
}

export interface MeResponse {
  user: User;
}

export async function login(email: string, password: string): Promise<LoginResponse> {
  return apiFetch<LoginResponse>(`${API_BASE}/api/auth/login`, {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
}

export async function me(): Promise<MeResponse> {
  return apiFetch<MeResponse>(`${API_BASE}/api/auth/me`);
}

