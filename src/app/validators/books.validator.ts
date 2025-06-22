import { z } from "zod";
import { Genre } from "../interfaces/book.interface";

const BookSchema = z.object({
  title: z
    .string({ required_error: "Title is required" })
    .trim()
    .nonempty("Title cannot be empty"),

  author: z
    .string({ required_error: "Author is required" })
    .trim()
    .nonempty("Author cannot be empty"),

  genre: z.nativeEnum(Genre, {
    errorMap: () => ({
      message: `Genre must be one of these: ${Object.values(Genre).join(", ")}`,
    }),
  }),

  isbn: z
    .string({ required_error: "ISBN is required" })
    .trim()
    .nonempty("ISBN cannot be empty"),

  description: z.string().optional(),

  copies: z.coerce
    .number({ required_error: "Copies is required" })
    .int("Copies must be an integer")
    .nonnegative("Copies can't be negative"),

  available: z.boolean().optional().default(true),
});

export default BookSchema;
