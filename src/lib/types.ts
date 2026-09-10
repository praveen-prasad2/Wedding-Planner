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

export type TodoCategoryDTO = {
  _id: string;
  userId: string;
  name: string;
  icon: string;
  color: string;
  createdAt: string;
};

export type TodoItemDTO = {
  _id: string;
  userId: string;
  todoCategoryId: string;
  title: string;
  notes?: string;
  status: ExpenseStatus;
  dueDate?: string;
  createdAt: string;
  updatedAt: string;
};
