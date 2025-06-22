import { Schema, UpdateQuery, model } from "mongoose";
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

bookSchema.pre("save", function (next) {
  this.available = this.copies > 0;
  next();
});

bookSchema.pre("findOneAndUpdate", function (next) {
  const update = this.getUpdate() as UpdateQuery<IBook>;

  const copies =
    (update.copies as number | undefined) ??
    (update.$set?.copies as number | undefined);

  if (copies !== undefined) {
    const available = copies > 0;

    if (update.$set) {
      update.$set.available = available;
    } else {
      update.available = available;
    }
  }

  next();
});

const Book = model<IBook>("Book", bookSchema);
export default Book;
