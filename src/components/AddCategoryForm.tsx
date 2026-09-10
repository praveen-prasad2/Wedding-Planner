"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";
import { useToast } from "@/components/Toast";
import { CategoryIcon, ICON_OPTIONS } from "@/components/CategoryIcon";
import type { CategoryDTO } from "@/lib/types";

export const CATEGORY_COLOR_OPTIONS = ["#8B3A3A", "#B76E79", "#C9A227", "#7B4B94", "#4B6858"];

export function AddCategoryForm({
  onCreated,
  submitLabel = "Add category",
}: {
  onCreated: (category: CategoryDTO) => void;
  submitLabel?: string;
}) {
  const { showToast } = useToast();
  const [name, setName] = useState("");
  const [icon, setIcon] = useState<string>(ICON_OPTIONS[0]);
  const [color, setColor] = useState(CATEGORY_COLOR_OPTIONS[0]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (!name.trim()) return setError("Category name is required");

    setSaving(true);
    try {
      const res = await fetch("/api/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: name.trim(), icon, color }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Failed to add category");
      }
      const created = await res.json();
      onCreated(created);
      showToast("Category added");
      setName("");
      setIcon(ICON_OPTIONS[0]);
      setColor(CATEGORY_COLOR_OPTIONS[0]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <input
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Category name"
        className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm text-foreground outline-none focus:border-maroon"
      />
      <div className="flex flex-wrap gap-2">
        {ICON_OPTIONS.map((opt) => (
          <button
            type="button"
            key={opt}
            onClick={() => setIcon(opt)}
            className={`flex h-9 w-9 items-center justify-center rounded-lg border ${
              icon === opt ? "border-maroon bg-blush" : "border-border"
            }`}
          >
            <CategoryIcon name={opt} size={16} />
          </button>
        ))}
      </div>
      <div className="flex gap-2">
        {CATEGORY_COLOR_OPTIONS.map((opt) => (
          <button
            type="button"
            key={opt}
            onClick={() => setColor(opt)}
            style={{ backgroundColor: opt }}
            className={`h-7 w-7 rounded-full ${
              color === opt ? "ring-2 ring-offset-2 ring-maroon" : ""
            }`}
          />
        ))}
      </div>

      {error && <p className="text-sm font-medium text-maroon">{error}</p>}

      <button
        type="submit"
        disabled={saving}
        className="flex w-full items-center justify-center gap-1.5 rounded-xl bg-maroon py-2.5 text-sm font-semibold text-white disabled:opacity-60"
      >
        {saving && <Loader2 size={15} className="animate-spin" />}
        {submitLabel}
      </button>
    </form>
  );
}
