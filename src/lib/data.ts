import { isValidObjectId } from "mongoose";
import { connectToDatabase } from "@/lib/mongodb";
import { Category } from "@/models/Category";
import { Expense } from "@/models/Expense";
import { User } from "@/models/User";
import { TodoCategory } from "@/models/TodoCategory";
import { TodoItem } from "@/models/TodoItem";
import { serialize } from "@/lib/serialize";
import type { CategoryDTO, ExpenseDTO, TodoCategoryDTO, TodoItemDTO } from "@/lib/types";

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

export async function getTodoCategoriesForUser(userId: string): Promise<TodoCategoryDTO[]> {
  await connectToDatabase();
  const categories = await TodoCategory.find({ userId }).sort({ createdAt: 1 }).lean();
  return serialize(categories) as unknown as TodoCategoryDTO[];
}

export async function getTodoCategoryById(
  userId: string,
  todoCategoryId: string
): Promise<TodoCategoryDTO | null> {
  if (!isValidObjectId(todoCategoryId)) return null;
  await connectToDatabase();
  const category = await TodoCategory.findOne({ _id: todoCategoryId, userId }).lean();
  if (!category) return null;
  return serialize(category) as unknown as TodoCategoryDTO;
}

export async function getTodosForUser(userId: string): Promise<TodoItemDTO[]> {
  await connectToDatabase();
  const todos = await TodoItem.find({ userId }).sort({ createdAt: -1 }).lean();
  return serialize(todos) as unknown as TodoItemDTO[];
}

export async function getTodosForCategory(
  userId: string,
  todoCategoryId: string
): Promise<TodoItemDTO[]> {
  await connectToDatabase();
  const todos = await TodoItem.find({ userId, todoCategoryId }).sort({ createdAt: -1 }).lean();
  return serialize(todos) as unknown as TodoItemDTO[];
}

export async function getTodoById(userId: string, todoId: string): Promise<TodoItemDTO | null> {
  if (!isValidObjectId(todoId)) return null;
  await connectToDatabase();
  const todo = await TodoItem.findOne({ _id: todoId, userId }).lean();
  if (!todo) return null;
  return serialize(todo) as unknown as TodoItemDTO;
}
