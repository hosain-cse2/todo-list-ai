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
          <div className="grid gap-4 sm:grid-cols-2">
            {projects.map((project) => {
              const total = project.todos.length;
              const completed = project.todos.filter((t) => t.completed).length;
              const pending = total - completed;

              return (
                <div
                  key={project.id}
                  className="flex flex-col justify-between rounded-xl border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-950"
                >
                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-medium">{project.name}</h3>
                      {/* Delete UI only – no behavior yet */}
                      <button
                        type="button"
                        className="text-xs text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200"
                        onClick={() => {
                          // Placeholder – delete not implemented yet
                          // eslint-disable-next-line no-console
                          console.log("Delete project not implemented");
                        }}
                      >
                        Delete
                      </button>
                    </div>
                    <p className="text-xs text-zinc-600 dark:text-zinc-400">
                      {project.description}
                    </p>
                  </div>

                  <div className="mt-3 grid grid-cols-3 gap-2 text-xs text-zinc-600 dark:text-zinc-400">
                    <div>
                      <div>Total</div>
                      <div className="font-semibold text-zinc-900 dark:text-zinc-50">
                        {total}
                      </div>
                    </div>
                    <div>
                      <div>Completed</div>
                      <div className="font-semibold text-zinc-900 dark:text-zinc-50">
                        {completed}
                      </div>
                    </div>
                    <div>
                      <div>Pending</div>
                      <div className="font-semibold text-zinc-900 dark:text-zinc-50">
                        {pending}
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 flex justify-end gap-2">
                    <Link
                      href={`/projects/${project.id}`}
                      className="rounded-lg border border-zinc-300 px-3 py-1.5 text-xs font-medium text-zinc-700 transition-colors hover:bg-zinc-100 dark:border-zinc-700 dark:text-zinc-200 dark:hover:bg-zinc-800"
                    >
                      View project
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

