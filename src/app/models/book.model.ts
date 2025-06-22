import { Schema, model } from "mongoose";
import IBook, { Genre } from "../interfaces/book.interface";

const bookSchema = new Schema<IBook>(
  {
    title: { type: String, required: true },
    author: { type: String, required: true },
    genre: {
      type: String,
      required: true,
      enum: Genre,
    },
    isbn: { type: String, required: true, unique: true },
    description: { type: String },
    copies: {
      type: Number,
      required: true,
      validate: {
        validator: Number.isInteger,
        message: "Copies must be an integer",
      },
      min: [0, "Copies cannot be negative"],
    },
    available: { type: Boolean, default: true },
  },
  {
    timestamps: true,
  }
);

const Book = model<IBook>("Book", bookSchema);
export default Book;
