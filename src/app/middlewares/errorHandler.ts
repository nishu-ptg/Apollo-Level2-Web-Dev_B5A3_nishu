import { Request, Response, NextFunction } from "express";

const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (err instanceof SyntaxError && "body" in err) {
    res.status(400).json({
      success: false,
      message: "Invalid JSON data.",
      error: err,
    });
    return;
  }

  res.status(500).json({
    success: false,
    message: "Internal Server Error",
    error: err,
  });
};

export default errorHandler;
