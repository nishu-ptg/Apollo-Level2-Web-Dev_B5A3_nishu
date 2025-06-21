import express, { Request, Response } from "express";
import booksRoutes from "./app/controllers/books.controller";
import borrowRoutes from "./app/controllers/borrow.controller";

const app = express();

app.use(express.json());

// Note: all routes inside api/ retuns json
// anything outside api/ returns html

app.use("/api/books", booksRoutes);
app.use("/api/borrow", borrowRoutes);

app.get("/", (req: Request, res: Response) => {
  res.send(
    "<h1>Welcome to the Library Management API with Express, TypeScript & MongoDB</h1>"
  );
});

app.use("/api", (req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    message: "404 route not found",
  });
});

app.use((req: Request, res: Response) => {
  res.status(404).send("<h1>404 Not Found</h1>");
});

export default app;
