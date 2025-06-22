import mongoose, { Schema, model } from "mongoose";
import IBorrow from "../interfaces/borrow.interface";

const borrowSchema = new Schema<IBorrow>(
  {
    book: { type: mongoose.Schema.Types.ObjectId, ref: "Book", required: true },
    quantity: {
      type: Number,
      required: true,
      min: [1, "Quantity must be at least 1"],
      validate: {
        validator: Number.isInteger,
        message: "Quantity must be an integer",
      },
    },
    dueDate: {
      type: Date,
      required: true,
      validate: {
        validator: (value: Date) => value.getTime() > Date.now(),
        message: "Due date must be in the future",
      },
    },
  },
  { timestamps: true }
);

const Borrow = model<IBorrow>("Borrow", borrowSchema);
export default Borrow;
