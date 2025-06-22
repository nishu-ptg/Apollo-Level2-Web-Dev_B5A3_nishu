import express, { Request, Response } from "express";
import Book from "../models/book.model";
import Borrow from "../models/borrow.model";

const borrowRoutes = express.Router();

// 6. Borrow a Book
borrowRoutes.post("/", async (req: Request, res: Response) => {
  try {
    const { book: bookId, quantity, dueDate } = req.body;

    const book = await Book.findById(bookId);
    if (!book) {
      res.status(404).json({
        success: false,
        message: `Book not found with ID: '${bookId}'`,
      });
      return;
    }

    if (!book.available) {
      res.status(400).json({
        success: false,
        message: `Book '${book.title}' (ISBN: ${book.isbn}) is not available for borrowing`,
      });
      return;
    }

    if (book.copies < quantity) {
      res.status(400).json({
        success: false,
        message: `Not enough copies, available: ${book.copies}, requested: ${quantity}`,
      });
      return;
    }

    book.copies -= quantity;
    book.available = book.copies > 0;
    await book.save();

    const borrow = await Borrow.create({
      book: bookId,
      quantity,
      dueDate,
    });

    res.status(201).json({
      success: true,
      message: "Book borrowed successfully",
      data: borrow,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: (error as Error).message || "Failed to borrow book",
      error,
    });
  }
});

// 7. Borrowed Books Summary
borrowRoutes.get("/", async (req: Request, res: Response) => {
  try {
    const summary = await Borrow.aggregate([
      {
        $group: {
          _id: "$book",
          totalQuantity: { $sum: "$quantity" },
        },
      },
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

    res.json({
      success: true,
      message: "Borrowed books summary retrieved successfully",
      data: summary,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: (error as Error).message || "Failed to retrieve summary",
      error,
    });
  }
});

export default borrowRoutes;
