import { apiFetch } from "@/lib/fetcher";

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000";

export interface LoginResponse {
  user: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
  };
}

export async function login(email: string, password: string): Promise<LoginResponse> {
  return apiFetch<LoginResponse>(`${API_BASE}/api/auth/login`, {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
}

