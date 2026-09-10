import { Schema, model, models, type InferSchemaType, type Model } from "mongoose";

const todoItemSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    todoCategoryId: { type: Schema.Types.ObjectId, ref: "TodoCategory", required: true, index: true },
    title: { type: String, required: true, trim: true },
    notes: { type: String, trim: true },
    status: { type: String, enum: ["completed", "pending"], default: "pending" },
    dueDate: { type: Date },
  },
  { timestamps: true }
);

export type TodoItemDoc = InferSchemaType<typeof todoItemSchema>;

export const TodoItem =
  (models.TodoItem as Model<TodoItemDoc>) ?? model<TodoItemDoc>("TodoItem", todoItemSchema);
