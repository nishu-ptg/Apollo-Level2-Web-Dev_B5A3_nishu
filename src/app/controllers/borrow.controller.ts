import express, { Request, Response } from "express";

const borrowRoutes = express.Router();

// 6. Borrow a Book
borrowRoutes.post("/", (req: Request, res: Response) => {
  res.json({
    success: true,
    message: "Book borrowed successfully",
    data: {
      // TODO
      //   _id: "64bc4a0f9e1c2d3f4b5a6789",
      //   book: "64ab3f9e2a4b5c6d7e8f9012",
      //   quantity: 2,
      //   dueDate: "2025-07-18T00:00:00.000Z",
      //   createdAt: "2025-06-18T07:12:15.123Z",
      //   updatedAt: "2025-06-18T07:12:15.123Z",
    },
  });
});

// 7. Borrowed Books Summary
borrowRoutes.get("/", (req: Request, res: Response) => {
  res.json({
    success: true,
    message: "Borrowed books summary retrieved successfully",
    data: [
      // TODO
      //   {
      //     "book": {
      //       "title": "The Theory of Everything",
      //       "isbn": "9780553380163"
      //     },
      //     "totalQuantity": 5
      //   },
      //   {
      //     "book": {
      //       "title": "1984",
      //       "isbn": "9780451524935"
      //     },
      //     "totalQuantity": 3
      //   }
    ],
  });
});

export default borrowRoutes;
