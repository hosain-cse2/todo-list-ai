"use client";

import { useRouter } from "next/navigation";
import { authApi } from "@/lib/api";

export function LogoutButton() {
  const router = useRouter();

  async function handleLogout() {
    try {
      await authApi.logout();
      router.push("/login");
      router.refresh();
    } catch {
      // Still redirect so user can log in again
      router.push("/login");
      router.refresh();
    }
  }

  return (
    <button
      type="button"
      onClick={handleLogout}
      className="text-sm text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
    >
      Logout
    </button>
  );
}
