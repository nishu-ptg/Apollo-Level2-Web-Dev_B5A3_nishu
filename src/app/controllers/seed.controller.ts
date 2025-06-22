import express, { Request, Response } from "express";
import Book from "../models/book.model";
import Borrow from "../models/borrow.model";
import { sampleBooks } from "../seed/books";
import { sendSuccess, sendError } from "../utils/response";

const seedRoutes = express.Router();

export const books = async (req: Request, res: Response) => {
  try {
    // await Borrow.deleteMany();
    // await Book.deleteMany();

    const seeded = await Book.insertMany(sampleBooks);

    sendSuccess(res, "Database seeded with default books", seeded);
  } catch (error) {
    sendError(
      res,
      (error as Error).message || "Failed to seed database",
      500,
      error
    );
  }
};

export const deleteAll = async (req: Request, res: Response) => {
  try {
    await Borrow.deleteMany();
    await Book.deleteMany();

    sendSuccess(res, "All books and borrows deleted successfully", null);
  } catch (error) {
    sendError(
      res,
      (error as Error).message || "Failed to delete records",
      500,
      error
    );
  }
};

seedRoutes.post("/books", books);
seedRoutes.delete("/all", deleteAll);

export default seedRoutes;
