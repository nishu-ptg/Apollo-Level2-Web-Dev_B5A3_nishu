import express, { Request, Response } from "express";
import Borrow from "../models/borrow.model";
import Book from "../models/book.model";
import BorrowSchema from "../validators/borrow.validator";
import { sendSuccess, sendError } from "../utils/response";
import checkNotEmptyBody from "../middlewares/checkNotEmptyBody";

const borrowRoutes = express.Router();

export const borrowBook = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const parsed = BorrowSchema.safeParse(req.body);
    if (!parsed.success) {
      sendError(res, "Validation failed", 400, parsed.error.errors);
      return;
    }

    const { book: bookId, quantity, dueDate } = parsed.data;
    const book = await Book.findById(bookId);

    if (!book) {
      sendError(res, `Invalid Book ID: '${bookId}'`, 404, null);
      return;
    }

    if (!book.available) {
      sendError(
        res,
        `Book '${book.title}' (ISBN: ${book.isbn}) is not available for borrowing`,
        400,
        null
      );
      return;
    }

    if (book.copies < quantity) {
      sendError(
        res,
        `Not enough copies available. Available: ${book.copies}, Requested: ${quantity}`,
        400,
        null
      );
      return;
    }

    book.copies -= quantity;
    await book.save();

    const borrow = await Borrow.create({ book: bookId, quantity, dueDate });
    sendSuccess(res, "Book borrowed successfully", borrow, 201);
  } catch (error) {
    sendError(
      res,
      (error as Error).message || "Failed to borrow book",
      500,
      error
    );
  }
};

export const getBorrowSummary = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const summary = await Borrow.getSummary();

    sendSuccess(res, "Borrowed books summary retrieved successfully", summary);
  } catch (error) {
    sendError(
      res,
      (error as Error).message || "Failed to retrieve summary",
      500,
      error
    );
  }
};

borrowRoutes.post("/", checkNotEmptyBody, borrowBook);
borrowRoutes.get("/", getBorrowSummary);

export default borrowRoutes;
