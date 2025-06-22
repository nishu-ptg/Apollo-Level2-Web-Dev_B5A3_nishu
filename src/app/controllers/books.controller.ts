import express, { Request, Response } from "express";
import Book from "./../models/book.model";

const booksRoutes = express.Router();

// 1. Create a Book
booksRoutes.post("/", async (req: Request, res: Response) => {
  try {
    const data = { ...req.body };
    data.available = data.copies > 0;

    const book = await Book.create(data);

    res.json({
      success: true,
      message: "Book created successfully",
      data: book,
    });
  } catch (error) {
    res.status(400).json({
      message: (error as Error).message || "Failed to create books",
      success: false,
      error,
    });
  }
});

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
      .limit(parseInt(limit as string));

    if (!books.length) {
      res.json({
        success: false,
        message: `No books found for filter: '${filter}'`,
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
    const book = await Book.findById(bookId);

    if (!book) {
      res.status(404).json({
        success: false,
        message: `Invalid book ID: '${bookId}'`,
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
booksRoutes.put("/:bookId", async (req: Request, res: Response) => {
  try {
    const { bookId } = req.params;
    const data = { ...req.body };
    data.available = data.copies > 0;

    const book = await Book.findByIdAndUpdate(bookId, data, {
      new: true,
    });

    if (!book) {
      return res.status(404).json({
        success: false,
        message: `Book not found with ID: '${bookId}'`,
        data: null,
      });
    }

    res.json({
      success: true,
      message: "Book updated successfully",
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

// 5. Delete a Book
booksRoutes.delete("/:bookId", async (req: Request, res: Response) => {
  try {
    const { bookId } = req.params;

    const book = await Book.findByIdAndDelete(bookId);

    if (!book) {
      return res.status(404).json({
        success: false,
        message: `Book not found with ID: '${bookId}'`,
        data: null,
      });
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
