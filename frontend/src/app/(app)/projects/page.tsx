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
  const [newProjectDescription, setNewProjectDescription] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const [createError, setCreateError] = useState<string | null>(null);

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

  const refetch = () => {
    projectsApi.getProjects().then(setProjects).catch(() => {});
  };

  const handleCreate = async () => {
    const name = newProjectName.trim();
    if (!name) return;
    setCreateError(null);
    setIsCreating(true);
    try {
      await projectsApi.createProject(name, newProjectDescription);
      setNewProjectName("");
      setNewProjectDescription("");
      refetch();
    } catch (err: unknown) {
      setCreateError(err instanceof Error ? err.message : "Failed to create project");
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Projects</h1>
        <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
          Organize your todos into focused projects.
        </p>
      </div>

      {/* Add Project */}
      <div className="rounded-lg border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-950">
        <div className="space-y-3">
          <input
            type="text"
            value={newProjectName}
            onChange={(e) => setNewProjectName(e.target.value)}
            placeholder="Project name"
            className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm transition-colors placeholder:text-zinc-400 focus:border-zinc-500 focus:outline-none focus:ring-2 focus:ring-zinc-500/20 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-50 dark:placeholder:text-zinc-500 dark:focus:border-zinc-600"
          />
          <textarea
            value={newProjectDescription}
            onChange={(e) => setNewProjectDescription(e.target.value)}
            placeholder="Description (optional)"
            rows={2}
            className="w-full resize-none rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm transition-colors placeholder:text-zinc-400 focus:border-zinc-500 focus:outline-none focus:ring-2 focus:ring-zinc-500/20 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-50 dark:placeholder:text-zinc-500 dark:focus:border-zinc-600"
          />
          {createError && (
            <p className="text-sm text-rose-600 dark:text-rose-400">{createError}</p>
          )}
          <button
            type="button"
            onClick={handleCreate}
            disabled={!newProjectName.trim() || isCreating}
            className="rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-zinc-800 disabled:opacity-50 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-100"
          >
            {isCreating ? "Adding…" : "Add Project"}
          </button>
        </div>
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
          No projects yet. Add one above to get started.
        </div>
      ) : (
        <div className="space-y-3">
          {projects.map((project) => {
            const total = project.todos.length;
            const completed = project.todos.filter((t) => t.completed).length;
            const pending = total - completed;

            return (
              <div
                key={project.id}
                className="flex overflow-hidden rounded-xl border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-950"
              >
                {/* Accent stripe */}
                <div
                  className="w-1.5 shrink-0 bg-zinc-400 dark:bg-zinc-600"
                  aria-hidden
                />
                <div className="min-w-0 flex-1 p-4">
                  <div className="flex flex-wrap items-start justify-between gap-2">
                    <div className="min-w-0">
                      <h2 className="text-base font-semibold text-zinc-900 dark:text-zinc-50">
                        {project.name}
                      </h2>
                      <p className="mt-0.5 text-sm text-zinc-600 dark:text-zinc-400">
                        {project.description}
                      </p>
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="rounded-full bg-zinc-100 px-2.5 py-0.5 text-xs font-medium text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300">
                        {total} total
                      </span>
                      <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-medium text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300">
                        {completed} done
                      </span>
                      <span className="rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-medium text-amber-800 dark:bg-amber-900/40 dark:text-amber-300">
                        {pending} to do
                      </span>
                    </div>
                  </div>
                  <div className="mt-4 flex flex-wrap gap-2">
                    <Link
                      href={`/projects/${project.id}`}
                      className="rounded-lg bg-zinc-900 px-3 py-1.5 text-sm font-medium text-white transition-colors hover:bg-zinc-800 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-100"
                    >
                      Open project
                    </Link>
                    <button
                      type="button"
                      className="rounded-lg border border-zinc-300 px-3 py-1.5 text-sm font-medium text-zinc-600 transition-colors hover:bg-zinc-100 hover:text-zinc-900 dark:border-zinc-700 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-200"
                      onClick={() => {
                        // Placeholder – delete not implemented yet
                        // eslint-disable-next-line no-console
                        console.log("Delete project not implemented");
                      }}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
