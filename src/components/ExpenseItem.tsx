"use client";

import { useState } from "react";
import Link from "next/link";
import { CheckCircle2, Circle, ChevronDown, Pencil, Trash2, Phone } from "lucide-react";
import { formatCurrency, cn } from "@/lib/utils";
import { ConfirmDialog } from "@/components/ConfirmDialog";
import { useToast } from "@/components/Toast";
import type { ExpenseDTO } from "@/lib/types";

export function ExpenseItem({
  expense,
  onToggleStatus,
  onDelete,
  showCategoryTag,
  categoryName,
}: {
  expense: ExpenseDTO;
  onToggleStatus: (id: string, nextStatus: "completed" | "pending") => void;
  onDelete: (id: string) => void;
  showCategoryTag?: boolean;
  categoryName?: string;
}) {
  const [expanded, setExpanded] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const { showToast } = useToast();

  const isCompleted = expense.status === "completed";

  async function handleDelete() {
    setDeleting(true);
    try {
      const res = await fetch(`/api/expenses/${expense._id}`, { method: "DELETE" });
      if (!res.ok) throw new Error();
      onDelete(expense._id);
      showToast("Expense deleted");
    } catch {
      showToast("Failed to delete expense", "error");
    } finally {
      setDeleting(false);
      setConfirmOpen(false);
    }
  }

  return (
    <div className="rounded-2xl border border-border bg-card shadow-sm">
      <div className="flex items-start gap-3 p-4">
        <button
          onClick={() => onToggleStatus(expense._id, isCompleted ? "pending" : "completed")}
          aria-label={isCompleted ? "Mark as pending" : "Mark as completed"}
          className="mt-0.5 shrink-0 text-success active:scale-90 transition-transform"
        >
          {isCompleted ? <CheckCircle2 size={24} /> : <Circle size={24} className="text-muted" />}
        </button>

        <button className="flex-1 text-left" onClick={() => setExpanded((v) => !v)}>
          <div className="flex items-start justify-between gap-2">
            <p
              className={cn(
                "font-medium text-foreground",
                isCompleted && "text-muted line-through"
              )}
            >
              {expense.title}
            </p>
            <p className="shrink-0 font-semibold text-foreground">{formatCurrency(expense.amount)}</p>
          </div>
          <div className="mt-1 flex flex-wrap items-center gap-2">
            <span
              className={cn(
                "rounded-full px-2 py-0.5 text-xs font-medium",
                isCompleted ? "bg-success-light text-success" : "bg-pending-light text-pending"
              )}
            >
              {isCompleted ? "Completed" : "Pending"}
            </span>
            {showCategoryTag && categoryName && (
              <span className="rounded-full bg-blush px-2 py-0.5 text-xs font-medium text-blush-dark">
                {categoryName}
              </span>
            )}
            {!expanded && expense.notes && (
              <span className="truncate text-xs text-muted">{expense.notes}</span>
            )}
          </div>
        </button>

        <ChevronDown
          size={18}
          className={cn("mt-1 shrink-0 text-muted transition-transform", expanded && "rotate-180")}
          onClick={() => setExpanded((v) => !v)}
        />
      </div>

      {expanded && (
        <div className="border-t border-border px-4 py-3">
          {expense.vendorName && (
            <div className="mb-1.5 flex items-center gap-1.5 text-sm text-foreground">
              <Phone size={14} className="text-muted" />
              {expense.vendorName}
            </div>
          )}
          {expense.dueDate && (
            <p className="mb-1.5 text-sm text-muted">
              Due {new Date(expense.dueDate).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
            </p>
          )}
          {expense.notes && <p className="mb-3 whitespace-pre-wrap text-sm text-muted">{expense.notes}</p>}

          <div className="flex gap-2">
            <Link
              href={`/expenses/${expense._id}/edit`}
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
        title="Delete this expense?"
        description={`"${expense.title}" will be permanently removed.`}
        confirmLabel={deleting ? "Deleting..." : "Delete"}
        onConfirm={handleDelete}
        onCancel={() => setConfirmOpen(false)}
      />
    </div>
  );
}
