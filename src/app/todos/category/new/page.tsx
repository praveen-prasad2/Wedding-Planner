"use client";

import { useRouter } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import { AddCategoryForm } from "@/components/AddCategoryForm";
import type { TodoCategoryDTO } from "@/lib/types";

export default function NewTodoCategoryPage() {
  const router = useRouter();

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
        <h1 className="text-base font-semibold text-foreground">New To Do Category</h1>
        <div className="w-14" />
      </div>

      <AddCategoryForm<TodoCategoryDTO>
        endpoint="/api/todo-categories"
        submitLabel="Add category"
        onCreated={(created) => {
          router.push(`/todos/category/${created._id}`);
          router.refresh();
        }}
      />
    </div>
  );
}
