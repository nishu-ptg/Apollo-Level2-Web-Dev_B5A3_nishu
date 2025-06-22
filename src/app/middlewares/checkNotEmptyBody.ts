import { Request, Response, NextFunction } from "express";

const checkNotEmptyBody = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  if (!req.body || Object.keys(req.body).length === 0) {
    res.status(400).json({
      success: false,
      message: "Request body is empty.",
      error: null,
    });
    return;
  }
  next();
};

export default checkNotEmptyBody;
