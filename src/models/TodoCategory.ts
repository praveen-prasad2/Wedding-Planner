import { Schema, model, models, type InferSchemaType, type Model } from "mongoose";

const todoCategorySchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    name: { type: String, required: true, trim: true },
    icon: { type: String, required: true, default: "ListChecks" },
    color: { type: String, required: true, default: "#B76E79" },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

export type TodoCategoryDoc = InferSchemaType<typeof todoCategorySchema>;

export const TodoCategory =
  (models.TodoCategory as Model<TodoCategoryDoc>) ??
  model<TodoCategoryDoc>("TodoCategory", todoCategorySchema);
