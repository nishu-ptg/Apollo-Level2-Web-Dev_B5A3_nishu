import mongoose, { Schema, model } from "mongoose";
import { IBorrow, IBorrowModel } from "../interfaces/borrow.interface";

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

borrowSchema.statics.getSummary = function () {
  return this.aggregate([
    { $group: { _id: "$book", totalQuantity: { $sum: "$quantity" } } },
    {
      $lookup: {
        from: "books",
        localField: "_id",
        foreignField: "_id",
        as: "book",
      },
    },
    { $unwind: "$book" },
    {
      $project: {
        _id: 0,
        book: {
          title: "$book.title",
          isbn: "$book.isbn",
        },
        totalQuantity: 1,
      },
    },
  ]);
};

const Borrow = model<IBorrow, IBorrowModel>("Borrow", borrowSchema);

export default Borrow;
