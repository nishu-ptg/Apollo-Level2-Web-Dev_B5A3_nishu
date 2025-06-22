import mongoose, { Schema, model } from "mongoose";
import IBorrow from "../interfaces/borrow.interface";

const borrowSchema = new Schema<IBorrow>(
  {
    book: { type: mongoose.Schema.Types.ObjectId, ref: "Book", required: true },
    quantity: { type: Number, required: true, min: 1 },
    dueDate: { type: Date, required: true },
  },
  { timestamps: true }
);

const Borrow = model<IBorrow>("Borrow", borrowSchema);
export default Borrow;
