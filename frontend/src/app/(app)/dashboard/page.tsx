"use client";

import { useEffect, useMemo, useState } from "react";
import type { Project } from "@/lib/api/projects";
import { projectsApi } from "@/lib/api";
import Link from "next/link";

interface DashboardStats {
  totalTodos: number;
  completedTodos: number;
  pendingTodos: number;
}

export default function DashboardPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    projectsApi
      .getProjects()
      .then((data) => {
        if (!cancelled) {
          setProjects(data);
          setIsLoading(false);
        }
      })
      .catch((err: unknown) => {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : "Failed to load data");
          setIsLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const stats: DashboardStats = useMemo(() => {
    const allTodos = projects.flatMap((p) => p.todos);
    const totalTodos = allTodos.length;
    const completedTodos = allTodos.filter((t) => t.completed).length;
    const pendingTodos = totalTodos - completedTodos;

    return { totalTodos, completedTodos, pendingTodos };
  }, [projects]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Dashboard</h1>
        <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
          Overview of your projects and their todos.
        </p>
      </div>

      {/* Global Stats */}
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-lg border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-950">
          <div className="text-sm text-zinc-600 dark:text-zinc-400">
            Total Todos
          </div>
          <div className="mt-1 text-2xl font-semibold">
            {stats.totalTodos}
          </div>
        </div>
        <div className="rounded-lg border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-950">
          <div className="text-sm text-zinc-600 dark:text-zinc-400">
            Completed
          </div>
          <div className="mt-1 text-2xl font-semibold">
            {stats.completedTodos}
          </div>
        </div>
        <div className="rounded-lg border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-950">
          <div className="text-sm text-zinc-600 dark:text-zinc-400">
            Pending
          </div>
          <div className="mt-1 text-2xl font-semibold">
            {stats.pendingTodos}
          </div>
        </div>
      </div>

      {/* Projects Overview */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
            Projects
          </h2>
          <Link
            href="/projects"
            className="text-xs font-medium text-zinc-600 underline-offset-2 hover:underline dark:text-zinc-400"
          >
            View all projects
          </Link>
        </div>

        {isLoading ? (
          <div className="rounded-lg border border-zinc-200 bg-white p-4 text-sm text-zinc-600 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-400">
            Loading projects...
          </div>
        ) : error ? (
          <div className="rounded-lg border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700 dark:border-rose-900 dark:bg-rose-950/40 dark:text-rose-300">
            {error}
          </div>
        ) : projects.length === 0 ? (
          <div className="rounded-lg border border-zinc-200 bg-white p-4 text-sm text-zinc-600 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-400">
            No projects yet. You can create one from the Projects page.
          </div>
        ) : (
          <div className="rounded-xl border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-950">
            <ul className="divide-y divide-zinc-200 dark:divide-zinc-800">
              {projects.map((project) => {
                const total = project.todos.length;
                const completed = project.todos.filter((t) => t.completed).length;
                const pct = total > 0 ? Math.round((completed / total) * 100) : 0;

                return (
                  <li key={project.id} className="flex items-center gap-4 p-4">
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-2">
                        <Link
                          href={`/projects/${project.id}`}
                          className="truncate text-sm font-medium text-zinc-900 hover:underline dark:text-zinc-50"
                        >
                          {project.name}
                        </Link>
                        <span className="shrink-0 text-xs text-zinc-500 dark:text-zinc-400">
                          {completed}/{total}
                        </span>
                      </div>
                      <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-zinc-200 dark:bg-zinc-800">
                        <div
                          className="h-full rounded-full bg-zinc-700 dark:bg-zinc-300"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                    <Link
                      href={`/projects/${project.id}`}
                      className="shrink-0 text-xs font-medium text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
                    >
                      Open →
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}

