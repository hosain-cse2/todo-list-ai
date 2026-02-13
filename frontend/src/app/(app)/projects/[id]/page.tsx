"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { projectsApi } from "@/lib/api";
import type { Project, Todo } from "@/lib/api/projects";
import { formatDateGerman } from "@/lib/utils";

export default function ProjectDetailPage() {
  const params = useParams<{ id: string }>();
  const id = params.id;

  const [project, setProject] = useState<Project | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [newTodoText, setNewTodoText] = useState("");
  const [isAddingTodo, setIsAddingTodo] = useState(false);
  const [addTodoError, setAddTodoError] = useState<string | null>(null);
  const [deletingTodoId, setDeletingTodoId] = useState<string | null>(null);
  const [editingTodoId, setEditingTodoId] = useState<string | null>(null);
  const [editTodoText, setEditTodoText] = useState("");
  const [savingTodoId, setSavingTodoId] = useState<string | null>(null);
  const [editTodoError, setEditTodoError] = useState<string | null>(null);
  const [togglingTodoId, setTogglingTodoId] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [editError, setEditError] = useState<string | null>(null);
  const [isGeneratingTodos, setIsGeneratingTodos] = useState(false);
  const [generateError, setGenerateError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    let cancelled = false;

    projectsApi
      .getProject(id)
      .then((data) => {
        if (!cancelled) {
          setProject(data);
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
  }, [id]);

  const handleDeleteTodo = async (todoId: string) => {
    if (!id) return;
    setDeletingTodoId(todoId);
    try {
      await projectsApi.deleteTodo(id, todoId);
      setProject((prev) =>
        prev ? { ...prev, todos: prev.todos.filter((t) => t.id !== todoId) } : null,
      );
    } finally {
      setDeletingTodoId(null);
    }
  };

  const startEditingTodo = (todo: Todo) => {
    setEditingTodoId(todo.id);
    setEditTodoText(todo.text);
    setEditTodoError(null);
  };

  const cancelEditingTodo = () => {
    setEditingTodoId(null);
    setEditTodoError(null);
  };

  const handleSaveTodoEdit = async () => {
    if (!id || !editingTodoId) return;
    const text = editTodoText.trim();
    if (!text) {
      setEditTodoError("Text is required");
      return;
    }
    setEditTodoError(null);
    setSavingTodoId(editingTodoId);
    try {
      const updated = await projectsApi.updateTodo(id, editingTodoId, { text });
      setProject((prev) =>
        prev
          ? {
              ...prev,
              todos: prev.todos.map((t) => (t.id === updated.id ? updated : t)),
            }
          : null,
      );
      setEditingTodoId(null);
    } catch (err: unknown) {
      setEditTodoError(err instanceof Error ? err.message : "Failed to update todo");
    } finally {
      setSavingTodoId(null);
    }
  };

  const handleToggleComplete = async (todo: Todo) => {
    if (!id) return;
    setTogglingTodoId(todo.id);
    try {
      const updated = await projectsApi.updateTodo(id, todo.id, {
        completed: !todo.completed,
      });
      setProject((prev) =>
        prev
          ? {
              ...prev,
              todos: prev.todos.map((t) => (t.id === updated.id ? updated : t)),
            }
          : null,
      );
    } finally {
      setTogglingTodoId(null);
    }
  };

  const startEditing = () => {
    if (project) {
      setEditName(project.name);
      setEditDescription(project.description);
      setEditError(null);
      setIsEditing(true);
    }
  };

  const cancelEditing = () => {
    setIsEditing(false);
    setEditError(null);
  };

  const handleSaveEdit = async () => {
    if (!id || !project) return;
    const name = editName.trim();
    if (!name) {
      setEditError("Name is required");
      return;
    }
    setEditError(null);
    setIsSaving(true);
    try {
      const updated = await projectsApi.updateProject(id, {
        name,
        description: editDescription.trim(),
      });
      setProject(updated);
      setIsEditing(false);
    } catch (err: unknown) {
      setEditError(err instanceof Error ? err.message : "Failed to update project");
    } finally {
      setIsSaving(false);
    }
  };

  const handleAddTodo = async () => {
    const text = newTodoText.trim();
    if (!text || !id) return;
    setAddTodoError(null);
    setIsAddingTodo(true);
    try {
      const todo = await projectsApi.createTodo(id, text);
      setProject((prev) =>
        prev ? { ...prev, todos: [todo, ...prev.todos] } : null,
      );
      setNewTodoText("");
    } catch (err: unknown) {
      setAddTodoError(err instanceof Error ? err.message : "Failed to add todo");
    } finally {
      setIsAddingTodo(false);
    }
  };

  const handleGenerateTodos = async () => {
    if (!id) return;
    setGenerateError(null);
    setIsGeneratingTodos(true);
    try {
      const updated = await projectsApi.generateTodos(id);
      setProject(updated);
    } catch (err: unknown) {
      setGenerateError(err instanceof Error ? err.message : "Failed to generate todos");
    } finally {
      setIsGeneratingTodos(false);
    }
  };

  const { totalCount, completedCount, pendingCount } = useMemo(() => {
    if (!project) {
      return { totalCount: 0, completedCount: 0, pendingCount: 0 };
    }
    const total = project.todos.length;
    const completed = project.todos.filter((t) => t.completed).length;
    return { totalCount: total, completedCount: completed, pendingCount: total - completed };
  }, [project]);

  if (isLoading) {
    return (
      <div className="rounded-lg border border-zinc-200 bg-white p-4 text-sm text-zinc-600 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-400">
        Loading project...
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="rounded-lg border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700 dark:border-rose-900 dark:bg-rose-950/40 dark:text-rose-300">
        {error ?? "Project not found"}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0 flex-1 space-y-1">
          <div className="flex items-center gap-2">
            <Link
              href="/projects"
              className="text-xs uppercase tracking-[0.2em] text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-200"
            >
              Projects
            </Link>
            <span className="text-zinc-400">/</span>
            <span className="truncate text-xs uppercase tracking-[0.2em] text-zinc-500">
              {project.name}
            </span>
          </div>
          {isEditing ? (
            <div className="space-y-2">
              <input
                type="text"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                placeholder="Project name"
                className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-lg font-semibold transition-colors focus:border-zinc-500 focus:outline-none focus:ring-2 focus:ring-zinc-500/20 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-50 dark:focus:border-zinc-600"
              />
              <textarea
                value={editDescription}
                onChange={(e) => setEditDescription(e.target.value)}
                placeholder="Description"
                rows={2}
                className="w-full resize-none rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm transition-colors focus:border-zinc-500 focus:outline-none focus:ring-2 focus:ring-zinc-500/20 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-50 dark:focus:border-zinc-600"
              />
              {editError && (
                <p className="text-sm text-rose-600 dark:text-rose-400">{editError}</p>
              )}
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={handleSaveEdit}
                  disabled={isSaving}
                  className="rounded-lg bg-zinc-900 px-3 py-1.5 text-sm font-medium text-white transition-colors hover:bg-zinc-800 disabled:opacity-50 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-100"
                >
                  {isSaving ? "Saving…" : "Save"}
                </button>
                <button
                  type="button"
                  onClick={cancelEditing}
                  disabled={isSaving}
                  className="rounded-lg border border-zinc-300 px-3 py-1.5 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-100 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800 disabled:opacity-50"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <>
              <h1 className="text-2xl font-semibold tracking-tight">
                {project.name}
              </h1>
              <p className="text-sm text-zinc-600 dark:text-zinc-400">
                {project.description || "—"}
              </p>
            </>
          )}
        </div>
        {!isEditing && (
          <button
            type="button"
            onClick={startEditing}
            className="shrink-0 rounded-lg border border-zinc-300 px-3 py-1.5 text-sm font-medium text-zinc-600 transition-colors hover:bg-zinc-100 dark:border-zinc-700 dark:text-zinc-400 dark:hover:bg-zinc-800"
          >
            Edit
          </button>
        )}
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-lg border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-950">
          <div className="text-sm text-zinc-600 dark:text-zinc-400">
            Total Todos
          </div>
          <div className="mt-1 text-2xl font-semibold">{totalCount}</div>
        </div>
        <div className="rounded-lg border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-950">
          <div className="text-sm text-zinc-600 dark:text-zinc-400">
            Completed
          </div>
          <div className="mt-1 text-2xl font-semibold">{completedCount}</div>
        </div>
        <div className="rounded-lg border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-950">
          <div className="text-sm text-zinc-600 dark:text-zinc-400">
            Pending
          </div>
          <div className="mt-1 text-2xl font-semibold">{pendingCount}</div>
        </div>
      </div>

      {/* Add Todo */}
      <div className="space-y-2">
        <div className="flex flex-wrap items-center gap-2">
          <input
            type="text"
            value={newTodoText}
            onChange={(e) => setNewTodoText(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleAddTodo()}
            placeholder="Add a new todo to this project..."
            className="min-w-0 flex-1 rounded-lg border border-zinc-300 bg-white px-4 py-2 text-sm transition-colors placeholder:text-zinc-400 focus:border-zinc-500 focus:outline-none focus:ring-2 focus:ring-zinc-500/20 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-50 dark:placeholder:text-zinc-500 dark:focus:border-zinc-600"
          />
          <button
            type="button"
            onClick={handleAddTodo}
            disabled={!newTodoText.trim() || isAddingTodo}
            className="rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-zinc-800 disabled:opacity-50 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-100"
          >
            {isAddingTodo ? "Adding…" : "Add Todo"}
          </button>
          <button
            type="button"
            onClick={handleGenerateTodos}
            disabled={isGeneratingTodos}
            className="rounded-lg border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-600 transition-colors hover:bg-zinc-100 disabled:opacity-50 dark:border-zinc-700 dark:text-zinc-400 dark:hover:bg-zinc-800"
            title="Generate todo suggestions from project name and description"
          >
            {isGeneratingTodos ? "Generating…" : "✨ Generate with AI"}
          </button>
        </div>
        {addTodoError && (
          <p className="text-sm text-rose-600 dark:text-rose-400">{addTodoError}</p>
        )}
        {generateError && (
          <p className="text-sm text-rose-600 dark:text-rose-400">{generateError}</p>
        )}
        {editTodoError && (
          <p className="text-sm text-rose-600 dark:text-rose-400">{editTodoError}</p>
        )}
      </div>

      {/* Todo List */}
      <div className="space-y-2">
        {project.todos.length === 0 ? (
          <div className="rounded-lg border border-zinc-200 bg-white p-8 text-center dark:border-zinc-800 dark:bg-zinc-950">
            <p className="text-sm text-zinc-600 dark:text-zinc-400">
              No todos in this project yet. Add one above to get started!
            </p>
          </div>
        ) : (
          <>
            {/* Pending Todos */}
            {project.todos.filter((todo) => !todo.completed).length > 0 && (
              <div className="space-y-2">
                <h2 className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                  Pending
                </h2>
                {project.todos
                  .filter((todo) => !todo.completed)
                  .map((todo) => (
                    <div
                      key={todo.id}
                      className="flex items-center gap-3 rounded-lg border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-950"
                    >
                      <input
                        type="checkbox"
                        checked={todo.completed}
                        onChange={() => handleToggleComplete(todo)}
                        disabled={togglingTodoId === todo.id}
                        className="h-4 w-4 rounded border-zinc-300 text-zinc-900 focus:ring-zinc-500 dark:border-zinc-700 dark:text-zinc-50"
                      />
                      {editingTodoId === todo.id ? (
                        <div className="flex flex-1 flex-col gap-2 sm:flex-row sm:items-center">
                          <input
                            type="text"
                            value={editTodoText}
                            onChange={(e) => setEditTodoText(e.target.value)}
                            placeholder="Todo text"
                            className="min-w-0 flex-1 rounded-lg border border-zinc-300 bg-white px-3 py-1.5 text-sm focus:border-zinc-500 focus:outline-none focus:ring-2 focus:ring-zinc-500/20 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-50"
                          />
                          <div className="flex gap-1">
                            <button
                              type="button"
                              onClick={handleSaveTodoEdit}
                              disabled={savingTodoId === todo.id}
                              className="rounded bg-zinc-900 px-2 py-1 text-xs font-medium text-white hover:bg-zinc-800 disabled:opacity-50 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-100"
                            >
                              {savingTodoId === todo.id ? "…" : "Save"}
                            </button>
                            <button
                              type="button"
                              onClick={cancelEditingTodo}
                              disabled={savingTodoId === todo.id}
                              className="rounded border border-zinc-300 px-2 py-1 text-xs text-zinc-700 hover:bg-zinc-100 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800 disabled:opacity-50"
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      ) : (
                        <span className="flex-1 text-sm text-zinc-900 dark:text-zinc-50">
                          {todo.text}
                        </span>
                      )}
                      {editingTodoId !== todo.id && (
                        <>
                          <span className="text-xs text-zinc-500 dark:text-zinc-400">
                            {formatDateGerman(todo.createdAt)}
                          </span>
                          <button
                            type="button"
                            onClick={() => startEditingTodo(todo)}
                            className="rounded px-2 py-1 text-xs text-zinc-500 transition-colors hover:bg-zinc-100 hover:text-zinc-900 dark:hover:bg-zinc-800 dark:hover:text-zinc-200"
                          >
                            Edit
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteTodo(todo.id)}
                            disabled={deletingTodoId === todo.id}
                            className="rounded px-2 py-1 text-xs text-zinc-500 transition-colors hover:bg-zinc-100 hover:text-zinc-900 disabled:opacity-50 dark:hover:bg-zinc-800 dark:hover:text-zinc-200"
                          >
                            {deletingTodoId === todo.id ? "…" : "Delete"}
                          </button>
                        </>
                      )}
                    </div>
                  ))}
              </div>
            )}

            {/* Completed Todos */}
            {project.todos.filter((todo) => todo.completed).length > 0 && (
              <div className="space-y-2 pt-4">
                <h2 className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                  Completed
                </h2>
                {project.todos
                  .filter((todo) => todo.completed)
                  .map((todo) => (
                    <div
                      key={todo.id}
                      className="flex items-center gap-3 rounded-lg border border-zinc-200 bg-white p-4 opacity-75 dark:border-zinc-800 dark:bg-zinc-950"
                    >
                      <input
                        type="checkbox"
                        checked={todo.completed}
                        onChange={() => handleToggleComplete(todo)}
                        disabled={togglingTodoId === todo.id}
                        className="h-4 w-4 rounded border-zinc-300 text-zinc-900 focus:ring-zinc-500 dark:border-zinc-700 dark:text-zinc-50"
                      />
                      {editingTodoId === todo.id ? (
                        <div className="flex flex-1 flex-col gap-2 sm:flex-row sm:items-center">
                          <input
                            type="text"
                            value={editTodoText}
                            onChange={(e) => setEditTodoText(e.target.value)}
                            placeholder="Todo text"
                            className="min-w-0 flex-1 rounded-lg border border-zinc-300 bg-white px-3 py-1.5 text-sm focus:border-zinc-500 focus:outline-none focus:ring-2 focus:ring-zinc-500/20 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-50"
                          />
                          <div className="flex gap-1">
                            <button
                              type="button"
                              onClick={handleSaveTodoEdit}
                              disabled={savingTodoId === todo.id}
                              className="rounded bg-zinc-900 px-2 py-1 text-xs font-medium text-white hover:bg-zinc-800 disabled:opacity-50 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-100"
                            >
                              {savingTodoId === todo.id ? "…" : "Save"}
                            </button>
                            <button
                              type="button"
                              onClick={cancelEditingTodo}
                              disabled={savingTodoId === todo.id}
                              className="rounded border border-zinc-300 px-2 py-1 text-xs text-zinc-700 hover:bg-zinc-100 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800 disabled:opacity-50"
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      ) : (
                        <span className="flex-1 text-sm text-zinc-500 line-through dark:text-zinc-500">
                          {todo.text}
                        </span>
                      )}
                      {editingTodoId !== todo.id && (
                        <>
                          <span className="text-xs text-zinc-500 dark:text-zinc-400">
                            {formatDateGerman(todo.createdAt)}
                          </span>
                          <button
                            type="button"
                            onClick={() => startEditingTodo(todo)}
                            className="rounded px-2 py-1 text-xs text-zinc-500 transition-colors hover:bg-zinc-100 hover:text-zinc-900 dark:hover:bg-zinc-800 dark:hover:text-zinc-200"
                          >
                            Edit
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteTodo(todo.id)}
                            disabled={deletingTodoId === todo.id}
                            className="rounded px-2 py-1 text-xs text-zinc-500 transition-colors hover:bg-zinc-100 hover:text-zinc-900 disabled:opacity-50 dark:hover:bg-zinc-800 dark:hover:text-zinc-200"
                          >
                            {deletingTodoId === todo.id ? "…" : "Delete"}
                          </button>
                        </>
                      )}
                    </div>
                  ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
