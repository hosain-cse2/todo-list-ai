"use client";

import { useEffect, useState } from "react";
import { authApi, type User } from "@/lib/api";

interface SessionState {
  user: User | null;
  isLoading: boolean;
  error: Error | null;
}

export function useSession() {
  const [session, setSession] = useState<SessionState>({
    user: null,
    isLoading: true,
    error: null,
  });

  useEffect(() => {
    let cancelled = false;

    authApi
      .me()
      .then((data) => {
        if (!cancelled) {
          setSession({ user: data.user, isLoading: false, error: null });
        }
      })
      .catch((err) => {
        if (!cancelled) {
          setSession({ user: null, isLoading: false, error: err });
        }
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return session;
}
