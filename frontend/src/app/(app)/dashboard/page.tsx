"use client";

import { useState } from "react";

interface Todo {
  id: string;
  text: string;
  completed: boolean;
}

export default function DashboardPage() {
  const [todos, setTodos] = useState<Todo[]>([
    { id: "1", text: "Complete project proposal", completed: false },
    { id: "2", text: "Review code changes", completed: true },
    { id: "3", text: "Update documentation", completed: false },
  ]);
  const [newTodo, setNewTodo] = useState("");

  const addTodo = () => {
    if (newTodo.trim()) {
      setTodos([
        ...todos,
        { id: Date.now().toString(), text: newTodo, completed: false },
      ]);
      setNewTodo("");
    }
  };

  const toggleTodo = (id: string) => {
    setTodos(
      todos.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo,
      ),
    );
  };

  const deleteTodo = (id: string) => {
    setTodos(todos.filter((todo) => todo.id !== id));
  };

  const completedCount = todos.filter((todo) => todo.completed).length;
  const totalCount = todos.length;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Dashboard</h1>
        <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
          Manage your todos and stay organized.
        </p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-lg border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-950">
          <div className="text-sm text-zinc-600 dark:text-zinc-400">Total</div>
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
          placeholder="Add a new todo..."
          className="flex-1 rounded-lg border border-zinc-300 bg-white px-4 py-2 text-sm transition-colors placeholder:text-zinc-400 focus:border-zinc-500 focus:outline-none focus:ring-2 focus:ring-zinc-500/20 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-50 dark:placeholder:text-zinc-500 dark:focus:border-zinc-600"
        />
        <button
          onClick={addTodo}
          className="rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-zinc-800 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-100"
        >
          Add
        </button>
      </div>

      {/* Todo List */}
      <div className="space-y-2">
        {todos.length === 0 ? (
          <div className="rounded-lg border border-zinc-200 bg-white p-8 text-center dark:border-zinc-800 dark:bg-zinc-950">
            <p className="text-sm text-zinc-600 dark:text-zinc-400">
              No todos yet. Add one above to get started!
            </p>
          </div>
        ) : (
          todos.map((todo) => (
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
              <span
                className={`flex-1 text-sm ${
                  todo.completed
                    ? "text-zinc-500 line-through dark:text-zinc-500"
                    : "text-zinc-900 dark:text-zinc-50"
                }`}
              >
                {todo.text}
              </span>
              <button
                onClick={() => deleteTodo(todo.id)}
                className="rounded px-2 py-1 text-xs text-zinc-500 transition-colors hover:bg-zinc-100 hover:text-zinc-900 dark:hover:bg-zinc-800 dark:hover:text-zinc-200"
              >
                Delete
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
