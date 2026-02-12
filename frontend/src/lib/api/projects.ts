import { apiFetch } from "@/lib/fetcher";

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000";

export interface Project {
  id: string;
  name: string;
  description?: string;
}

export async function getProjects(): Promise<Project[]> {
  const data = await apiFetch<{ projects: Project[] }>(
    `${API_BASE}/api/projects`,
  );
  return data.projects;
}

