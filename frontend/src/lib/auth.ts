import { cookies } from "next/headers";

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000";

export async function checkSession(): Promise<boolean> {
  const cookieStore = await cookies();
  const token = cookieStore.get("accessToken");

  if (!token) return false;

  try {
    // Forward the cookie to the backend API
    const res = await fetch(`${API_BASE}/api/auth/me`, {
      headers: {
        Cookie: `accessToken=${token.value}`,
      },
      cache: "no-store",
    });
    return res.ok;
  } catch {
    return false;
  }
}
