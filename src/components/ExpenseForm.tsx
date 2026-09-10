"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft, Loader2, Trash2 } from "lucide-react";
import { useToast } from "@/components/Toast";
import { ConfirmDialog } from "@/components/ConfirmDialog";
import type { CategoryDTO, ExpenseDTO } from "@/lib/types";

function toDateInputValue(dateStr?: string) {
  if (!dateStr) return "";
  return new Date(dateStr).toISOString().slice(0, 10);
}

export function ExpenseForm({
  categories,
  initialExpense,
  defaultCategoryId,
}: {
  categories: CategoryDTO[];
  initialExpense?: ExpenseDTO;
  defaultCategoryId?: string;
}) {
  const router = useRouter();
  const { showToast } = useToast();
  const isEdit = !!initialExpense;

  const [title, setTitle] = useState(initialExpense?.title ?? "");
  const [categoryId, setCategoryId] = useState(
    initialExpense?.categoryId ?? defaultCategoryId ?? categories[0]?._id ?? ""
  );
  const [amount, setAmount] = useState(initialExpense ? String(initialExpense.amount) : "");
  const [status, setStatus] = useState<"completed" | "pending">(initialExpense?.status ?? "pending");
  const [vendorName, setVendorName] = useState(initialExpense?.vendorName ?? "");
  const [dueDate, setDueDate] = useState(toDateInputValue(initialExpense?.dueDate));
  const [notes, setNotes] = useState(initialExpense?.notes ?? "");

  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    const amountNum = Number(amount);
    if (!title.trim()) return setError("Title is required");
    if (!categoryId) return setError("Please choose a category");
    if (!amount || Number.isNaN(amountNum) || amountNum < 0) return setError("Enter a valid amount");

    setSaving(true);
    try {
      const payload = {
        title: title.trim(),
        categoryId,
        amount: amountNum,
        status,
        vendorName: vendorName.trim(),
        notes: notes.trim(),
        dueDate,
      };

      const res = await fetch(isEdit ? `/api/expenses/${initialExpense!._id}` : "/api/expenses", {
        method: isEdit ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Failed to save expense");
      }

      showToast(isEdit ? "Expense updated" : "Expense added");
      router.push(`/category/${categoryId}`);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!initialExpense) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/expenses/${initialExpense._id}`, { method: "DELETE" });
      if (!res.ok) throw new Error();
      showToast("Expense deleted");
      router.push(`/category/${initialExpense.categoryId}`);
      router.refresh();
    } catch {
      showToast("Failed to delete expense", "error");
      setDeleting(false);
      setConfirmOpen(false);
    }
  }

  return (
    <div className="px-4 pt-6 pb-10">
      <div className="mb-5 flex items-center justify-between">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-1 text-sm font-medium text-muted"
          type="button"
        >
          <ChevronLeft size={16} /> Cancel
        </button>
        <h1 className="text-base font-semibold text-foreground">
          {isEdit ? "Edit Expense" : "Add Expense"}
        </h1>
        <div className="w-14" />
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="mb-1.5 block text-sm font-medium text-foreground">Item name</label>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full rounded-xl border border-border bg-card px-4 py-3 text-foreground outline-none focus:border-maroon"
            placeholder="e.g. Auditorium booking advance"
          />
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium text-foreground">Category</label>
          <select
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
            className="w-full rounded-xl border border-border bg-card px-4 py-3 text-foreground outline-none focus:border-maroon"
          >
            {categories.map((c) => (
              <option key={c._id} value={c._id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium text-foreground">Amount (₹)</label>
          <input
            type="number"
            inputMode="decimal"
            min={0}
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full rounded-xl border border-border bg-card px-4 py-3 text-foreground outline-none focus:border-maroon"
            placeholder="0"
          />
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium text-foreground">Status</label>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setStatus("pending")}
              className={`flex-1 rounded-xl border py-3 text-sm font-medium transition-colors ${
                status === "pending"
                  ? "border-pending bg-pending-light text-pending"
                  : "border-border text-muted"
              }`}
            >
              Pending
            </button>
            <button
              type="button"
              onClick={() => setStatus("completed")}
              className={`flex-1 rounded-xl border py-3 text-sm font-medium transition-colors ${
                status === "completed"
                  ? "border-success bg-success-light text-success"
                  : "border-border text-muted"
              }`}
            >
              Completed
            </button>
          </div>
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium text-foreground">Vendor name (optional)</label>
          <input
            value={vendorName}
            onChange={(e) => setVendorName(e.target.value)}
            className="w-full rounded-xl border border-border bg-card px-4 py-3 text-foreground outline-none focus:border-maroon"
            placeholder="e.g. Sri Ganesh Caterers"
          />
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium text-foreground">Due date (optional)</label>
          <input
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            className="w-full rounded-xl border border-border bg-card px-4 py-3 text-foreground outline-none focus:border-maroon"
          />
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium text-foreground">Notes (optional)</label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={4}
            className="w-full rounded-xl border border-border bg-card px-4 py-3 text-foreground outline-none focus:border-maroon"
            placeholder="Contact number, delivery details, reminders..."
          />
        </div>

        {error && <p className="text-sm font-medium text-maroon">{error}</p>}

        <button
          type="submit"
          disabled={saving}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-maroon py-3.5 text-sm font-semibold text-white active:scale-[0.98] transition-transform disabled:opacity-60"
        >
          {saving && <Loader2 size={16} className="animate-spin" />}
          {isEdit ? "Save changes" : "Add expense"}
        </button>

        {isEdit && (
          <button
            type="button"
            onClick={() => setConfirmOpen(true)}
            className="flex w-full items-center justify-center gap-2 rounded-xl border border-maroon/30 py-3.5 text-sm font-semibold text-maroon active:scale-[0.98] transition-transform"
          >
            <Trash2 size={16} /> Delete expense
          </button>
        )}
      </form>

      <ConfirmDialog
        open={confirmOpen}
        title="Delete this expense?"
        description={initialExpense ? `"${initialExpense.title}" will be permanently removed.` : undefined}
        confirmLabel={deleting ? "Deleting..." : "Delete"}
        onConfirm={handleDelete}
        onCancel={() => setConfirmOpen(false)}
      />
    </div>
  );
}
