export type CategoryDTO = {
  _id: string;
  userId: string;
  name: string;
  icon: string;
  color: string;
  budgetAmount: number;
  createdAt: string;
};

export type ExpenseStatus = "completed" | "pending";

export type ExpenseDTO = {
  _id: string;
  userId: string;
  categoryId: string;
  title: string;
  amount: number;
  vendorName?: string;
  notes?: string;
  status: ExpenseStatus;
  dueDate?: string;
  createdAt: string;
  updatedAt: string;
};
