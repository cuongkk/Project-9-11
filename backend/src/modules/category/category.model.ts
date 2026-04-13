import mongoose, { Document, Schema } from "mongoose";

export interface ICategory extends Document {
  name: string;
  parent?: string;
  position?: number;
  status?: string;
  description?: string;
  slug?: string;
  deletedAt?: Date;
}

const schema = new Schema<ICategory>(
  {
    name: { type: String },
    parent: { type: String },
    position: { type: Number },
    status: { type: String },
    description: { type: String },
    slug: { type: String, unique: true },
    deletedAt: { type: Date },
  },
  {
    timestamps: true,
  },
);

const Category = mongoose.model<ICategory>("Category", schema, "categories");

export default Category;
