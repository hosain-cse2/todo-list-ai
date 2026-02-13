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

export async function createProject(
  name: string,
  description?: string,
): Promise<Project> {
  const data = await apiFetch<{ project: Project }>(
    `${API_BASE}/api/projects`,
    {
      method: "POST",
      body: JSON.stringify({ name: name.trim(), description: description?.trim() ?? "" }),
    },
  );
  return data.project;
}

export async function updateProject(
  projectId: string,
  data: { name?: string; description?: string },
): Promise<Project> {
  const body: { name?: string; description?: string } = {};
  if (data.name !== undefined) body.name = data.name.trim();
  if (data.description !== undefined) body.description = data.description.trim();
  const res = await apiFetch<{ project: Project }>(
    `${API_BASE}/api/projects/${projectId}`,
    {
      method: "PATCH",
      body: JSON.stringify(body),
    },
  );
  return res.project;
}

export async function createTodo(projectId: string, text: string): Promise<Todo> {
  const data = await apiFetch<{ todo: Todo }>(
    `${API_BASE}/api/projects/${projectId}/todos`,
    {
      method: "POST",
      body: JSON.stringify({ text: text.trim() }),
    },
  );
  return data.todo;
}

export async function deleteProject(projectId: string): Promise<void> {
  const res = await fetch(`${API_BASE}/api/projects/${projectId}`, {
    method: "DELETE",
    credentials: "include",
  });
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`API request failed with ${res.status} ${res.statusText}: ${text}`);
  }
}

export async function deleteTodo(projectId: string, todoId: string): Promise<void> {
  const res = await fetch(`${API_BASE}/api/projects/${projectId}/todos/${todoId}`, {
    method: "DELETE",
    credentials: "include",
  });
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`API request failed with ${res.status} ${res.statusText}: ${text}`);
  }
}

