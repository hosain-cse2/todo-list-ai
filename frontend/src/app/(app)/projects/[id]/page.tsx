"use client";

import { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";

interface Todo {
  id: string;
  text: string;
  completed: boolean;
  createdAt: string;
}

interface Project {
  id: string;
  name: string;
  description: string;
  todos: Todo[];
}

interface ProjectPageProps {
  params: {
    id: string;
  };
}

export default function ProjectDetailPage() {
  const params = useParams<{ id: string }>();
  const id = params.id;

  // Mock project data - replace with API call later
  const [project, setProject] = useState<Project>({
    id: id,
    name: id === "1" ? "Personal Tasks" : "Work",
    description:
      id === "1"
        ? "Capture your daily todos and personal tasks."
        : "Track work items and priorities.",
    todos: [
      {
        id: "1",
        text: "Complete project proposal",
        completed: false,
        createdAt: "2024-01-15",
      },
      {
        id: "2",
        text: "Review code changes",
        completed: true,
        createdAt: "2024-01-14",
      },
      {
        id: "3",
        text: "Update documentation",
        completed: false,
        createdAt: "2024-01-13",
      },
      {
        id: "4",
        text: "Schedule team meeting",
        completed: true,
        createdAt: "2024-01-12",
      },
    ],
  });

  const [newTodo, setNewTodo] = useState("");

  const addTodo = () => {
    if (newTodo.trim()) {
      const todo: Todo = {
        id: Date.now().toString(),
        text: newTodo,
        completed: false,
        createdAt: new Date().toISOString().split("T")[0],
      };
      setProject({
        ...project,
        todos: [...project.todos, todo],
      });
      setNewTodo("");
    }
  };

  const toggleTodo = (todoId: string) => {
    setProject({
      ...project,
      todos: project.todos.map((todo) =>
        todo.id === todoId ? { ...todo, completed: !todo.completed } : todo,
      ),
    });
  };

  const deleteTodo = (todoId: string) => {
    setProject({
      ...project,
      todos: project.todos.filter((todo) => todo.id !== todoId),
    });
  };

  const completedCount = project.todos.filter((todo) => todo.completed).length;
  const totalCount = project.todos.length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Link
              href="/projects"
              className="text-xs uppercase tracking-[0.2em] text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-200"
            >
              Projects
            </Link>
            <span className="text-zinc-400">/</span>
            <span className="text-xs uppercase tracking-[0.2em] text-zinc-500">
              {project.name}
            </span>
          </div>
          <h1 className="text-2xl font-semibold tracking-tight">
            {project.name}
          </h1>
          <p className="text-sm text-zinc-600 dark:text-zinc-400">
            {project.description}
          </p>
        </div>
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
          <div className="mt-1 text-2xl font-semibold">
            {totalCount - completedCount}
          </div>
        </div>
      </div>

      {/* Add Todo Form */}
      <div className="flex gap-2">
        <input
          type="text"
          value={newTodo}
          onChange={(e) => setNewTodo(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && addTodo()}
          placeholder="Add a new todo to this project..."
          className="flex-1 rounded-lg border border-zinc-300 bg-white px-4 py-2 text-sm transition-colors placeholder:text-zinc-400 focus:border-zinc-500 focus:outline-none focus:ring-2 focus:ring-zinc-500/20 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-50 dark:placeholder:text-zinc-500 dark:focus:border-zinc-600"
        />
        <button
          onClick={addTodo}
          className="rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-zinc-800 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-100"
        >
          Add Todo
        </button>
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
                        onChange={() => toggleTodo(todo.id)}
                        className="h-4 w-4 rounded border-zinc-300 text-zinc-900 focus:ring-zinc-500 dark:border-zinc-700 dark:text-zinc-50"
                      />
                      <span className="flex-1 text-sm text-zinc-900 dark:text-zinc-50">
                        {todo.text}
                      </span>
                      <span className="text-xs text-zinc-500 dark:text-zinc-400">
                        {todo.createdAt}
                      </span>
                      <button
                        onClick={() => deleteTodo(todo.id)}
                        className="rounded px-2 py-1 text-xs text-zinc-500 transition-colors hover:bg-zinc-100 hover:text-zinc-900 dark:hover:bg-zinc-800 dark:hover:text-zinc-200"
                      >
                        Delete
                      </button>
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
                        onChange={() => toggleTodo(todo.id)}
                        className="h-4 w-4 rounded border-zinc-300 text-zinc-900 focus:ring-zinc-500 dark:border-zinc-700 dark:text-zinc-50"
                      />
                      <span className="flex-1 text-sm text-zinc-500 line-through dark:text-zinc-500">
                        {todo.text}
                      </span>
                      <span className="text-xs text-zinc-500 dark:text-zinc-400">
                        {todo.createdAt}
                      </span>
                      <button
                        onClick={() => deleteTodo(todo.id)}
                        className="rounded px-2 py-1 text-xs text-zinc-500 transition-colors hover:bg-zinc-100 hover:text-zinc-900 dark:hover:bg-zinc-800 dark:hover:text-zinc-200"
                      >
                        Delete
                      </button>
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
