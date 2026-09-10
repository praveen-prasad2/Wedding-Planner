"use client";

import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { ExpenseItem } from "@/components/ExpenseItem";
import { useToast } from "@/components/Toast";
import { cn } from "@/lib/utils";
import type { CategoryDTO, ExpenseDTO } from "@/lib/types";

type StatusFilter = "all" | "completed" | "pending";
type SortBy = "date" | "amount";

export function AllExpensesView({
  initialExpenses,
  categories,
}: {
  initialExpenses: ExpenseDTO[];
  categories: CategoryDTO[];
}) {
  const [expenses, setExpenses] = useState(initialExpenses);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [sortBy, setSortBy] = useState<SortBy>("date");
  const { showToast } = useToast();

  const categoryById = useMemo(() => {
    const map = new Map<string, CategoryDTO>();
    categories.forEach((c) => map.set(c._id, c));
    return map;
  }, [categories]);

  const filtered = useMemo(() => {
    let list = expenses;

    if (statusFilter !== "all") {
      list = list.filter((e) => e.status === statusFilter);
    }

    if (search.trim()) {
      const q = search.trim().toLowerCase();
      list = list.filter(
        (e) =>
          e.title.toLowerCase().includes(q) ||
          e.notes?.toLowerCase().includes(q) ||
          e.vendorName?.toLowerCase().includes(q)
      );
    }

    return [...list].sort((a, b) => {
      if (sortBy === "amount") return b.amount - a.amount;
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
  }, [expenses, search, statusFilter, sortBy]);

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

  return (
    <div className="px-4 pt-6">
      <h1 className="mb-4 text-xl font-semibold text-foreground">All Expenses</h1>

      <div className="mb-3 flex items-center gap-2 rounded-xl border border-border bg-card px-3 py-2.5">
        <Search size={18} className="text-muted" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by title, vendor, or note"
          className="w-full bg-transparent text-sm text-foreground outline-none"
        />
      </div>

      <div className="mb-3 flex gap-2 overflow-x-auto">
        {(["all", "pending", "completed"] as StatusFilter[]).map((s) => (
          <button
            key={s}
            onClick={() => setStatusFilter(s)}
            className={cn(
              "shrink-0 rounded-full border px-3.5 py-1.5 text-xs font-medium capitalize",
              statusFilter === s ? "border-maroon bg-maroon text-white" : "border-border text-muted"
            )}
          >
            {s}
          </button>
        ))}
        <div className="ml-auto shrink-0">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as SortBy)}
            className="rounded-full border border-border bg-card px-3 py-1.5 text-xs font-medium text-foreground"
          >
            <option value="date">Newest first</option>
            <option value="amount">Amount</option>
          </select>
        </div>
      </div>

      {filtered.length === 0 ? (
        <p className="rounded-2xl border border-dashed border-border bg-card p-6 text-center text-sm text-muted">
          No expenses match your search.
        </p>
      ) : (
        <div className="space-y-3 pb-4">
          {filtered.map((expense) => (
            <ExpenseItem
              key={expense._id}
              expense={expense}
              onToggleStatus={handleToggleStatus}
              onDelete={handleDelete}
              showCategoryTag
              categoryName={categoryById.get(expense.categoryId)?.name}
            />
          ))}
        </div>
      )}
    </div>
  );
}
