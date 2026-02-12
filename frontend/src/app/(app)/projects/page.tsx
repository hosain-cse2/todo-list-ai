"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { projectsApi } from "@/lib/api";
import type { Project } from "@/lib/api/projects";

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [newProjectName, setNewProjectName] = useState("");

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

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Projects</h1>
        <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
          Organize your todos into focused projects.
        </p>
      </div>

      {/* Add Project UI (no-op for now) */}
      <div className="rounded-lg border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-950">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          <input
            type="text"
            value={newProjectName}
            onChange={(e) => setNewProjectName(e.target.value)}
            placeholder="New project name..."
            className="flex-1 rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm transition-colors placeholder:text-zinc-400 focus:border-zinc-500 focus:outline-none focus:ring-2 focus:ring-zinc-500/20 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-50 dark:placeholder:text-zinc-500 dark:focus:border-zinc-600"
          />
          <button
            type="button"
            onClick={() => {
              // Placeholder – project creation not implemented yet
              // eslint-disable-next-line no-console
              console.log("Create project not implemented");
            }}
            className="mt-2 inline-flex items-center justify-center rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-zinc-800 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-100 sm:mt-0"
          >
            Add Project
          </button>
        </div>
        <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-500">
          This is UI-only for now; backend project creation will come later.
        </p>
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
        <div className="rounded-lg border border-zinc-200 bg-white p-8 text-center text-sm text-zinc-600 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-400">
          No projects yet. Use the form above to plan new projects (UI only for
          now).
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {projects.map((project) => (
            <div
              key={project.id}
              className="flex flex-col justify-between rounded-xl border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-950"
            >
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <h2 className="text-sm font-medium">{project.name}</h2>
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
                <p className="mt-1 text-xs text-zinc-600 dark:text-zinc-400">
                  {project.description}
                </p>
              </div>

              <div className="mt-3 grid grid-cols-3 gap-2 text-xs text-zinc-600 dark:text-zinc-400">
                <div>
                  <div>Total</div>
                  <div className="font-semibold text-zinc-900 dark:text-zinc-50">
                    {project.todos.length}
                  </div>
                </div>
                <div>
                  <div>Completed</div>
                  <div className="font-semibold text-zinc-900 dark:text-zinc-50">
                    {project.todos.filter((t) => t.completed).length}
                  </div>
                </div>
                <div>
                  <div>Pending</div>
                  <div className="font-semibold text-zinc-900 dark:text-zinc-50">
                    {
                      project.todos.length -
                      project.todos.filter((t) => t.completed).length
                    }
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
          ))}
        </div>
      )}
    </div>
  );
}
