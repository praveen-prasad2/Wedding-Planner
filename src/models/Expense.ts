import { Schema, model, models, type InferSchemaType, type Model } from "mongoose";

const expenseSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    categoryId: { type: Schema.Types.ObjectId, ref: "Category", required: true, index: true },
    title: { type: String, required: true, trim: true },
    amount: { type: Number, required: true, min: 0 },
    vendorName: { type: String, trim: true },
    notes: { type: String, trim: true },
    status: { type: String, enum: ["completed", "pending"], default: "pending" },
    dueDate: { type: Date },
  },
  { timestamps: true }
);

export type ExpenseDoc = InferSchemaType<typeof expenseSchema>;

export const Expense =
  (models.Expense as Model<ExpenseDoc>) ?? model<ExpenseDoc>("Expense", expenseSchema);
