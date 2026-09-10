"use client";

import { useState } from "react";
import { TodoItemRow } from "@/components/TodoItemRow";
import { useToast } from "@/components/Toast";
import type { TodoItemDTO } from "@/lib/types";

export function TodoList({ initialTodos }: { initialTodos: TodoItemDTO[] }) {
  const [todos, setTodos] = useState(initialTodos);
  const { showToast } = useToast();

  async function handleToggleStatus(id: string, nextStatus: "completed" | "pending") {
    const previous = todos;
    setTodos((prev) => prev.map((t) => (t._id === id ? { ...t, status: nextStatus } : t)));

    try {
      const res = await fetch(`/api/todos/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: nextStatus }),
      });
      if (!res.ok) throw new Error();
      showToast(nextStatus === "completed" ? "Marked as completed" : "Marked as pending");
    } catch {
      setTodos(previous);
      showToast("Failed to update status", "error");
    }
  }

  function handleDelete(id: string) {
    setTodos((prev) => prev.filter((t) => t._id !== id));
  }

  if (todos.length === 0) {
    return (
      <p className="rounded-2xl border border-dashed border-border bg-card p-6 text-center text-sm text-muted">
        No tasks yet — tap + Add Task to create one.
      </p>
    );
  }

  return (
    <div className="space-y-3">
      {todos.map((todo) => (
        <TodoItemRow key={todo._id} todo={todo} onToggleStatus={handleToggleStatus} onDelete={handleDelete} />
      ))}
    </div>
  );
}
