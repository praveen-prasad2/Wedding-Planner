import { Schema, model, models, type InferSchemaType, type Model } from "mongoose";

const categorySchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    name: { type: String, required: true, trim: true },
    icon: { type: String, required: true, default: "Sparkles" },
    color: { type: String, required: true, default: "#B76E79" },
    budgetAmount: { type: Number, default: 0 },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

export type CategoryDoc = InferSchemaType<typeof categorySchema>;

export const Category =
  (models.Category as Model<CategoryDoc>) ?? model<CategoryDoc>("Category", categorySchema);
