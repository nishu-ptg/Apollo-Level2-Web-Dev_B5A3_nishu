// routes/booksRoutes.ts
import express, { Request, Response } from "express";
import mongoose from "mongoose";
import Book from "../models/book.model";
import BookSchema from "../validators/books.validator";
import { sendSuccess, sendError } from "../utils/response";
import checkNotEmptyBody from "../middlewares/checkNotEmptyBody";

const booksRoutes = express.Router();

const createBook = async (req: Request, res: Response): Promise<void> => {
  try {
    const parsed = BookSchema.safeParse(req.body);
    if (!parsed.success) {
      sendError(res, "Validation failed", 400, parsed.error.errors);
      return;
    }

    const existing = await Book.findOne({ isbn: parsed.data.isbn });
    if (existing) {
      sendError(
        res,
        `A book with ISBN '${parsed.data.isbn}' already exists.`,
        400,
        null
      );
      return;
    }

    const book = await Book.create(parsed.data);
    sendSuccess(res, "Book created successfully", book, 201);
  } catch (error) {
    sendError(
      res,
      (error as Error).message || "Failed to create a book entry",
      500,
      error
    );
  }
};

const getAllBooks = async (req: Request, res: Response): Promise<void> => {
  try {
    const {
      filter,
      sortBy = "createdAt",
      sort = "asc",
      limit = "10",
      page = "1",
    } = req.query;

    const parsedLimit = Math.max(Number(limit), 1);
    const parsedPage = Math.max(Number(page), 1);
    const skip = (parsedPage - 1) * parsedLimit;

    const query: Record<string, any> = {};
    if (filter) query.genre = filter;

    const sortOrder = sort === "desc" ? -1 : 1;

    const books = await Book.find(query)
      .sort({ [sortBy as string]: sortOrder })
      .skip(skip)
      .limit(parsedLimit);

    if (!books.length) {
      sendSuccess(
        res,
        `No books found${filter ? ` for genre '${filter}'` : ""}`,
        []
      );
      return;
    }

    sendSuccess(res, "Books retrieved successfully", books);
  } catch (error) {
    sendError(
      res,
      (error as Error).message || "Failed to retrieve books",
      500,
      error
    );
  }
};


const getBookById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { bookId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(bookId)) {
      sendError(res, `Invalid Book ID format: '${bookId}'`, 400, null);
      return;
    }

    const book = await Book.findById(bookId);
    if (!book) {
      sendError(res, `Book not found with ID: '${bookId}'`, 404, null);
      return;
    }

    sendSuccess(res, "Book retrieved successfully", book);
  } catch (error) {
    sendError(
      res,
      (error as Error).message || "Failed to retrieve book",
      500,
      error
    );
  }
};

const updateBook = async (req: Request, res: Response): Promise<void> => {
  try {
    const { bookId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(bookId)) {
      sendError(res, `Invalid Book ID format: '${bookId}'`, 400, null);
      return;
    }

    const updateSchema = BookSchema.partial();
    const parsed = updateSchema.safeParse(req.body);
    if (!parsed.success) {
      sendError(res, "Validation failed", 400, parsed.error.errors);
      return;
    }

    if (Object.keys(parsed.data).length === 0) {
      sendError(res, "No relevant values passed for update.", 400, null);
      return;
    }

    const book = await Book.findByIdAndUpdate(bookId, parsed.data, {
      new: true,
      runValidators: true,
    });

    if (!book) {
      sendError(res, `Book not found with ID: '${bookId}'`, 404, null);
      return;
    }

    sendSuccess(res, "Book updated successfully", book);
  } catch (error) {
    sendError(
      res,
      (error as Error).message || "Failed to update book",
      500,
      error
    );
  }
};

const deleteBook = async (req: Request, res: Response): Promise<void> => {
  try {
    const { bookId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(bookId)) {
      sendError(res, `Invalid Book ID format: '${bookId}'`, 400, null);
      return;
    }

    const book = await Book.findByIdAndDelete(bookId);

    if (!book) {
      sendError(res, `Book not found with ID: '${bookId}'`, 404, null);
      return;
    }

    sendSuccess(res, "Book deleted successfully", null);
  } catch (error) {
    sendError(
      res,
      (error as Error).message || "Failed to delete book",
      500,
      error
    );
  }
};

booksRoutes.post("/", checkNotEmptyBody, createBook);
booksRoutes.get("/", getAllBooks);
booksRoutes.get("/:bookId", getBookById);
booksRoutes.put("/:bookId", checkNotEmptyBody, updateBook);
booksRoutes.delete("/:bookId", deleteBook);

export default booksRoutes;
