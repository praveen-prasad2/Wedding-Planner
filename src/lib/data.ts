import { isValidObjectId } from "mongoose";
import { connectToDatabase } from "@/lib/mongodb";
import { Category } from "@/models/Category";
import { Expense } from "@/models/Expense";
import { User } from "@/models/User";
import { serialize } from "@/lib/serialize";
import type { CategoryDTO, ExpenseDTO } from "@/lib/types";

export async function getCategoriesForUser(userId: string): Promise<CategoryDTO[]> {
  await connectToDatabase();
  const categories = await Category.find({ userId }).sort({ createdAt: 1 }).lean();
  return serialize(categories) as unknown as CategoryDTO[];
}

export async function getExpensesForUser(userId: string): Promise<ExpenseDTO[]> {
  await connectToDatabase();
  const expenses = await Expense.find({ userId }).sort({ createdAt: -1 }).lean();
  return serialize(expenses) as unknown as ExpenseDTO[];
}

export async function getUserBudget(userId: string): Promise<number> {
  await connectToDatabase();
  const user = await User.findById(userId).select("budgetAmount").lean();
  return user?.budgetAmount ?? 0;
}

export async function getCategoryById(userId: string, categoryId: string): Promise<CategoryDTO | null> {
  if (!isValidObjectId(categoryId)) return null;
  await connectToDatabase();
  const category = await Category.findOne({ _id: categoryId, userId }).lean();
  if (!category) return null;
  return serialize(category) as unknown as CategoryDTO;
}

export async function getExpensesForCategory(userId: string, categoryId: string): Promise<ExpenseDTO[]> {
  await connectToDatabase();
  const expenses = await Expense.find({ userId, categoryId }).sort({ createdAt: -1 }).lean();
  return serialize(expenses) as unknown as ExpenseDTO[];
}

export async function getExpenseById(userId: string, expenseId: string): Promise<ExpenseDTO | null> {
  if (!isValidObjectId(expenseId)) return null;
  await connectToDatabase();
  const expense = await Expense.findOne({ _id: expenseId, userId }).lean();
  if (!expense) return null;
  return serialize(expense) as unknown as ExpenseDTO;
}
