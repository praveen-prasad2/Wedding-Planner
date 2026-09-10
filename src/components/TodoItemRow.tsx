"use client";

import { useState } from "react";
import Link from "next/link";
import { CheckCircle2, Circle, ChevronDown, Pencil, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { ConfirmDialog } from "@/components/ConfirmDialog";
import { useToast } from "@/components/Toast";
import type { TodoItemDTO } from "@/lib/types";

export function TodoItemRow({
  todo,
  onToggleStatus,
  onDelete,
}: {
  todo: TodoItemDTO;
  onToggleStatus: (id: string, nextStatus: "completed" | "pending") => void;
  onDelete: (id: string) => void;
}) {
  const [expanded, setExpanded] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const { showToast } = useToast();

  const isCompleted = todo.status === "completed";

  async function handleDelete() {
    setDeleting(true);
    try {
      const res = await fetch(`/api/todos/${todo._id}`, { method: "DELETE" });
      if (!res.ok) throw new Error();
      onDelete(todo._id);
      showToast("Task deleted");
    } catch {
      showToast("Failed to delete task", "error");
    } finally {
      setDeleting(false);
      setConfirmOpen(false);
    }
  }

  return (
    <div className="rounded-2xl border border-border bg-card shadow-sm">
      <div className="flex items-start gap-3 p-4">
        <button
          onClick={() => onToggleStatus(todo._id, isCompleted ? "pending" : "completed")}
          aria-label={isCompleted ? "Mark as pending" : "Mark as completed"}
          className="mt-0.5 shrink-0 text-success active:scale-90 transition-transform"
        >
          {isCompleted ? <CheckCircle2 size={24} /> : <Circle size={24} className="text-muted" />}
        </button>

        <button className="flex-1 text-left" onClick={() => setExpanded((v) => !v)}>
          <p className={cn("font-medium text-foreground", isCompleted && "text-muted line-through")}>
            {todo.title}
          </p>
          {!expanded && todo.dueDate && (
            <p className="mt-1 text-xs text-muted">
              Due {new Date(todo.dueDate).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}
            </p>
          )}
        </button>

        <ChevronDown
          size={18}
          className={cn("mt-1 shrink-0 text-muted transition-transform", expanded && "rotate-180")}
          onClick={() => setExpanded((v) => !v)}
        />
      </div>

      {expanded && (
        <div className="border-t border-border px-4 py-3">
          {todo.dueDate && (
            <p className="mb-1.5 text-sm text-muted">
              Due{" "}
              {new Date(todo.dueDate).toLocaleDateString("en-IN", {
                day: "numeric",
                month: "short",
                year: "numeric",
              })}
            </p>
          )}
          {todo.notes && <p className="mb-3 whitespace-pre-wrap text-sm text-muted">{todo.notes}</p>}

          <div className="flex gap-2">
            <Link
              href={`/todos/item/${todo._id}/edit`}
              className="flex flex-1 items-center justify-center gap-1.5 rounded-xl border border-border py-2.5 text-sm font-medium text-foreground active:scale-95 transition-transform"
            >
              <Pencil size={15} /> Edit
            </Link>
            <button
              onClick={() => setConfirmOpen(true)}
              className="flex flex-1 items-center justify-center gap-1.5 rounded-xl border border-maroon/30 py-2.5 text-sm font-medium text-maroon active:scale-95 transition-transform"
            >
              <Trash2 size={15} /> Delete
            </button>
          </div>
        </div>
      )}

      <ConfirmDialog
        open={confirmOpen}
        title="Delete this task?"
        description={`"${todo.title}" will be permanently removed.`}
        confirmLabel={deleting ? "Deleting..." : "Delete"}
        onConfirm={handleDelete}
        onCancel={() => setConfirmOpen(false)}
      />
    </div>
  );
}
