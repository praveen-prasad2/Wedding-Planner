"use client";

import { useState } from "react";
import { ExpenseItem } from "@/components/ExpenseItem";
import { useToast } from "@/components/Toast";
import type { ExpenseDTO } from "@/lib/types";

export function CategoryExpenseList({ initialExpenses }: { initialExpenses: ExpenseDTO[] }) {
  const [expenses, setExpenses] = useState(initialExpenses);
  const { showToast } = useToast();

  async function handleToggleStatus(id: string, nextStatus: "completed" | "pending") {
    const previous = expenses;
    setExpenses((prev) => prev.map((e) => (e._id === id ? { ...e, status: nextStatus } : e)));

    try {
      const res = await fetch(`/api/expenses/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: nextStatus }),
      });
      if (!res.ok) throw new Error();
      showToast(nextStatus === "completed" ? "Marked as completed" : "Marked as pending");
    } catch {
      setExpenses(previous);
      showToast("Failed to update status", "error");
    }
  }

  function handleDelete(id: string) {
    setExpenses((prev) => prev.filter((e) => e._id !== id));
  }

  if (expenses.length === 0) {
    return (
      <p className="rounded-2xl border border-dashed border-border bg-card p-6 text-center text-sm text-muted">
        No expenses yet — tap + to add one.
      </p>
    );
  }

  return (
    <div className="space-y-3">
      {expenses.map((expense) => (
        <ExpenseItem
          key={expense._id}
          expense={expense}
          onToggleStatus={handleToggleStatus}
          onDelete={handleDelete}
        />
      ))}
    </div>
  );
}
