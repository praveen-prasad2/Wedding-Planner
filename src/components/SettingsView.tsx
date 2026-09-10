"use client";

import { useState } from "react";
import { signOut } from "next-auth/react";
import { Loader2, LogOut, Plus } from "lucide-react";
import { useToast } from "@/components/Toast";
import { CategoryIcon } from "@/components/CategoryIcon";
import { AddCategoryForm } from "@/components/AddCategoryForm";
import type { CategoryDTO } from "@/lib/types";

export function SettingsView({
  initialBudget,
  initialCategories,
}: {
  initialBudget: number;
  initialCategories: CategoryDTO[];
}) {
  const { showToast } = useToast();

  const [budget, setBudget] = useState(String(initialBudget || ""));
  const [savingBudget, setSavingBudget] = useState(false);

  const [categories, setCategories] = useState(initialCategories);
  const [categoryDrafts, setCategoryDrafts] = useState<Record<string, string>>(
    Object.fromEntries(initialCategories.map((c) => [c._id, String(c.budgetAmount || "")]))
  );
  const [savingCategoryId, setSavingCategoryId] = useState<string | null>(null);

  const [showAddCategory, setShowAddCategory] = useState(false);

  async function handleSaveBudget() {
    setSavingBudget(true);
    try {
      const res = await fetch("/api/settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ budgetAmount: Number(budget) || 0 }),
      });
      if (!res.ok) throw new Error();
      showToast("Budget updated");
    } catch {
      showToast("Failed to update budget", "error");
    } finally {
      setSavingBudget(false);
    }
  }

  async function handleSaveCategoryBudget(id: string) {
    setSavingCategoryId(id);
    try {
      const res = await fetch(`/api/categories/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ budgetAmount: Number(categoryDrafts[id]) || 0 }),
      });
      if (!res.ok) throw new Error();
      const updated = await res.json();
      setCategories((prev) => prev.map((c) => (c._id === id ? updated : c)));
      showToast("Category budget updated");
    } catch {
      showToast("Failed to update category budget", "error");
    } finally {
      setSavingCategoryId(null);
    }
  }

  function handleCategoryCreated(created: CategoryDTO) {
    setCategories((prev) => [...prev, created]);
    setCategoryDrafts((prev) => ({ ...prev, [created._id]: "" }));
    setShowAddCategory(false);
  }

  return (
    <div className="px-4 pt-6 pb-4">
      <h1 className="mb-5 text-xl font-semibold text-foreground">Settings</h1>

      <section className="mb-6 rounded-2xl border border-border bg-card p-4">
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-muted">
          Overall Budget
        </h2>
        <div className="flex gap-2">
          <input
            type="number"
            inputMode="decimal"
            min={0}
            value={budget}
            onChange={(e) => setBudget(e.target.value)}
            placeholder="e.g. 1500000"
            className="flex-1 rounded-xl border border-border bg-background px-4 py-3 text-foreground outline-none focus:border-maroon"
          />
          <button
            onClick={handleSaveBudget}
            disabled={savingBudget}
            className="flex items-center justify-center gap-1.5 rounded-xl bg-maroon px-4 text-sm font-semibold text-white active:scale-95 transition-transform disabled:opacity-60"
          >
            {savingBudget && <Loader2 size={15} className="animate-spin" />}
            Save
          </button>
        </div>
      </section>

      <section className="mb-6">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-muted">
            Category Budgets
          </h2>
          <button
            onClick={() => setShowAddCategory((v) => !v)}
            className="flex items-center gap-1 text-xs font-semibold text-maroon"
          >
            <Plus size={14} /> New category
          </button>
        </div>

        {showAddCategory && (
          <div className="mb-3 rounded-2xl border border-border bg-card p-4">
            <AddCategoryForm onCreated={handleCategoryCreated} />
          </div>
        )}

        <div className="space-y-2">
          {categories.map((category) => (
            <div
              key={category._id}
              className="flex items-center gap-3 rounded-2xl border border-border bg-card p-3"
            >
              <div
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg"
                style={{ backgroundColor: `${category.color}20`, color: category.color }}
              >
                <CategoryIcon name={category.icon} size={18} />
              </div>
              <span className="flex-1 text-sm font-medium text-foreground">{category.name}</span>
              <input
                type="number"
                inputMode="decimal"
                min={0}
                value={categoryDrafts[category._id] ?? ""}
                onChange={(e) =>
                  setCategoryDrafts((prev) => ({ ...prev, [category._id]: e.target.value }))
                }
                placeholder="Budget"
                className="w-24 rounded-lg border border-border bg-background px-2.5 py-2 text-right text-sm text-foreground outline-none focus:border-maroon"
              />
              <button
                onClick={() => handleSaveCategoryBudget(category._id)}
                disabled={savingCategoryId === category._id}
                className="rounded-lg bg-maroon px-2.5 py-2 text-xs font-semibold text-white disabled:opacity-60"
              >
                {savingCategoryId === category._id ? "..." : "Save"}
              </button>
            </div>
          ))}
        </div>
      </section>

      <button
        onClick={() => signOut({ callbackUrl: "/login" })}
        className="flex w-full items-center justify-center gap-2 rounded-xl border border-maroon/30 py-3.5 text-sm font-semibold text-maroon active:scale-[0.98] transition-transform"
      >
        <LogOut size={16} /> Logout
      </button>
    </div>
  );
}
