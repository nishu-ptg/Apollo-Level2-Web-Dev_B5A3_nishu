import express, { Request, Response } from "express";
import mongoose from "mongoose";
import Book from "./../models/book.model";
import BookSchema from "../validators/books.validator";
import checkNotEmptyBody from "../middlewares/checkNotEmptyBody";

const booksRoutes = express.Router();

// 1. Create a Book
booksRoutes.post(
  "/",
  checkNotEmptyBody,
  async (req: Request, res: Response) => {
    try {
      const parsed = BookSchema.safeParse(req.body);
      if (!parsed.success) {
        res.status(400).json({
          success: false,
          message: "Validation failed",
          error: parsed.error.errors,
        });
        return;
      }

      const book = await Book.create(parsed.data);

      res.status(201).json({
        success: true,
        message: "Book created successfully",
        data: book,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: (error as Error).message || "Failed to create book",
        error,
      });
    }
  }
);

// 2. Get All Books
booksRoutes.get("/", async (req: Request, res: Response) => {
  try {
    const {
      filter,
      sortBy = "createdAt",
      sort = "asc",
      limit = 10,
    } = req.query;

    const query: any = {};
    if (filter) {
      query.genre = filter;
    }

    const sortOrder = sort === "desc" ? -1 : 1;

    const books = await Book.find(query)
      .sort({ [sortBy as string]: sortOrder })
      .limit(Number(limit));

    if (!books.length) {
      res.json({
        success: false,
        message: `No books found${filter ? ` for genre '${filter}'` : ""}`,
        data: [],
      });
      return;
    }

    res.json({
      success: true,
      message: "Books retrieved successfully",
      data: books,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: (error as Error).message || "Failed to retrieve books",
      error,
    });
  }
});

// 3. Get a Book by ID
booksRoutes.get("/:bookId", async (req: Request, res: Response) => {
  try {
    const { bookId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(bookId)) {
      res.status(400).json({
        success: false,
        message: `Invalid Book ID format: '${bookId}'`,
        data: null,
      });
      return;
    }

    const book = await Book.findById(bookId);

    if (!book) {
      res.status(404).json({
        success: false,
        message: `Book not found with ID: '${bookId}'`,
        data: null,
      });
      return;
    }

    res.json({
      success: true,
      message: "Book retrieved successfully",
      data: book,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: (error as Error).message || "Failed to retrieve book",
      error,
    });
  }
});

// 4. Update a Book
booksRoutes.put(
  "/:bookId",
  checkNotEmptyBody,
  async (req: Request, res: Response) => {
    try {
      const { bookId } = req.params;

      if (!mongoose.Types.ObjectId.isValid(bookId)) {
        res.status(400).json({
          success: false,
          message: `Invalid Book ID format: '${bookId}'`,
          data: null,
        });
        return;
      }

      const updateSchema = BookSchema.partial();
      const parsed = updateSchema.safeParse(req.body);
      if (!parsed.success) {
        res.status(400).json({
          success: false,
          message: "Validation failed",
          error: parsed.error.errors,
        });
        return;
      }

      if (Object.keys(parsed.data).length === 0) {
        res.status(400).json({
          success: false,
          message: "Update data is empty. Please include at least one field.",
          error: null,
        });
        return;
      }

      const book = await Book.findByIdAndUpdate(bookId, parsed.data, {
        new: true,
        runValidators: true,
      });

      if (!book) {
        res.status(404).json({
          success: false,
          message: `Book not found with ID: '${bookId}'`,
          data: null,
        });
        return;
      }

      res.json({
        success: true,
        message: "Book updated successfully",
        data: book,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: (error as Error).message || "Failed to update book",
        error,
      });
    }
  }
);

// 5. Delete a Book
booksRoutes.delete("/:bookId", async (req: Request, res: Response) => {
  try {
    const { bookId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(bookId)) {
      res.status(400).json({
        success: false,
        message: `Invalid Book ID format: '${bookId}'`,
        data: null,
      });
      return;
    }

    const book = await Book.findByIdAndDelete(bookId);

    if (!book) {
      res.status(404).json({
        success: false,
        message: `Book not found with ID: '${bookId}'`,
        data: null,
      });
      return;
    }

    res.json({
      success: true,
      message: "Book deleted successfully",
      data: null,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: (error as Error).message || "Failed to delete book",
      error,
    });
  }
});

export default booksRoutes;
