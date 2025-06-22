import express, { Request, Response } from "express";
import booksRoutes from "./app/controllers/books.controller";
import borrowRoutes from "./app/controllers/borrow.controller";
import errorHandler from "./app/middlewares/errorHandler";
import { sendError } from "./app/utils/response";
import seedRoutes from "./app/controllers/seed.controller";

const app = express();

app.use(express.json());
app.use(errorHandler);

// Note: all routes inside api/ retuns json
// anything outside api/ returns html

app.use("/api/books", booksRoutes);
app.use("/api/borrow", borrowRoutes);
app.use("/api/admin/seed", seedRoutes);

app.get("/", (req: Request, res: Response) => {
  res.send(
    "<h1>Welcome to the Library Management API with Express, TypeScript & MongoDB</h1>"
  );
});

app.use("/api", (req: Request, res: Response) => {
  sendError(res, "404 route not found", 500, null);
});

app.use((req: Request, res: Response) => {
  res.status(404).send("<h1>404 Not Found</h1>");
});

export default app;
