import mongoose, { Document, Schema } from "mongoose";

export interface ITour extends Document {
  name: string;
  category?: string;
  position?: number;
  status?: string;
  avatar?: string;
  images?: string[];
  price?: number;
  priceNew?: number;
  stock?: number;
  locations?: any[];
  time?: string;
  departureDate?: Date;
  endDate?: Date;
  information?: string;
  schedules?: any[];
  rating?: number;
  reviewCount?: number;
  createdBy?: string;
  updatedBy?: string;
  slug?: string;
  deleted: boolean;
  deletedBy?: string;
  deletedAt?: Date;
}

const schema = new Schema<ITour>(
  {
    name: { type: String },
    category: { type: String },
    position: { type: Number },
    status: { type: String },
    avatar: { type: String },
    images: { type: [String], default: [] },
    price: { type: Number },
    priceNew: { type: Number },
    stock: { type: Number },
    locations: { type: [Schema.Types.Mixed], default: [] },
    time: { type: String },
    departureDate: { type: Date },
    endDate: { type: Date },
    information: { type: String },
    schedules: { type: [Schema.Types.Mixed], default: [] },
    rating: { type: Number, default: 0 },
    reviewCount: { type: Number, default: 0 },
    createdBy: { type: String },
    updatedBy: { type: String },
    slug: { type: String, unique: true },
    deleted: { type: Boolean, default: false },
    deletedBy: { type: String },
    deletedAt: { type: Date },
  },
  {
    timestamps: true,
  },
);

const Tour = mongoose.model<ITour>("Tour", schema, "tours");

export default Tour;
