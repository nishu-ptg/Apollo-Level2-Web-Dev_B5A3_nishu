import express, { Request, Response } from "express";
import Book from "./../models/book.model";

const booksRoutes = express.Router();

// 1. Create a Book
booksRoutes.post("/", async (req: Request, res: Response) => {
  try {
    const { title, author, genre, isbn, description, copies } = req.body;

    const book = await Book.create({
      title,
      author,
      genre,
      isbn,
      description,
      copies,
      available: copies > 0,
    });

    res.json({
      success: true,
      message: "Book created successfully",
      data: book,
    });
  } catch (error) {
    res.status(400).json({
      message: "Failed to create book",
      success: false,
      error: error,
    });
  }
});

// 2. Get All Books
booksRoutes.get("/", (req: Request, res: Response) => {
  res.json({
    success: true,
    message: "Books retrieved successfully",
    data: [
      // TODO
      // {
      //     "_id": "64f123abc4567890def12345",
      //     "title": "The Theory of Everything",
      //     "author": "Stephen Hawking",
      //     "genre": "SCIENCE",
      //     "isbn": "9780553380163",
      //     "description": "An overview of cosmology and black holes.",
      //     "copies": 5,
      //     "available": true,
      //     "createdAt": "2024-11-19T10:23:45.123Z",
      //     "updatedAt": "2024-11-19T10:23:45.123Z"
      //   },
      //   {...}
    ],
  });
});

// 3. Get a Book by ID
booksRoutes.get("/:bookId", (req: Request, res: Response) => {
  res.json({
    success: true,
    message: "Book retrieved successfully",
    data: {
      // TODO
      //   _id: "64f123abc4567890def12345",
      //   title: "The Theory of Everything",
      //   author: "Stephen Hawking",
      //   genre: "SCIENCE",
      //   isbn: "9780553380163",
      //   description: "An overview of cosmology and black holes.",
      //   copies: 5,
      //   available: true,
      //   createdAt: "2024-11-19T10:23:45.123Z",
      //   updatedAt: "2024-11-19T10:23:45.123Z",
    },
  });
});

// 4. Update a Book
booksRoutes.put("/:bookId", (req: Request, res: Response) => {
  res.json({
    success: true,
    message: "Book updated successfully",
    data: {
      // TODO
      //   _id: "64f123abc4567890def12345",
      //   title: "The Theory of Everything",
      //   author: "Stephen Hawking",
      //   genre: "SCIENCE",
      //   isbn: "9780553380163",
      //   description: "An overview of cosmology and black holes.",
      //   copies: 50,
      //   available: true,
      //   createdAt: "2024-11-19T10:23:45.123Z",
      //   updatedAt: "2024-11-20T08:30:00.000Z",
    },
  });
});

// 5. Delete a Book
booksRoutes.delete("/:bookId", (req: Request, res: Response) => {
  res.json({
    success: true,
    message: "Book deleted successfully",
    data: null,
  });
});

export default booksRoutes;
