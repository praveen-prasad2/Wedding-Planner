"use client";

import { useRouter } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import { AddCategoryForm } from "@/components/AddCategoryForm";

export default function NewCategoryPage() {
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
        <h1 className="text-base font-semibold text-foreground">New Category</h1>
        <div className="w-14" />
      </div>

      <AddCategoryForm
        submitLabel="Add category"
        onCreated={(created) => {
          router.push(`/category/${created._id}`);
          router.refresh();
        }}
      />
    </div>
  );
}
