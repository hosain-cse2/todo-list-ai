import { apiFetch } from "@/lib/fetcher";

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000";

export interface Todo {
  id: string;
  text: string;
  completed: boolean;
  createdAt: string;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  todos: Todo[];
}

export async function getProjects(): Promise<Project[]> {
  const data = await apiFetch<{ projects: Project[] }>(
    `${API_BASE}/api/projects`,
  );
  return data.projects;
}

export async function getProject(id: string): Promise<Project> {
  const data = await apiFetch<{ project: Project }>(
    `${API_BASE}/api/projects/${id}`,
  );
  return data.project;
}

