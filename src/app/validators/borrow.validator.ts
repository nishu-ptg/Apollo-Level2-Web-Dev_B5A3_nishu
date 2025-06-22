import { z } from "zod";

const BorrowSchema = z.object({
  book: z
    .string({ required_error: "Book ID is required" })
    .regex(/^[0-9a-fA-F]{24}$/, "Invalid Book ID"), // MongoDB ObjectId format

  quantity: z
    .number({ required_error: "Quantity is required" })
    .int("Quantity must be an integer")
    .positive("Quantity must be greater than zero"),

  dueDate: z
    .string({ required_error: "Due date is required" })
    .refine((val) => !isNaN(Date.parse(val)), {
      message: "Due date must be a valid ISO date string",
    }),
});

export default BorrowSchema;
