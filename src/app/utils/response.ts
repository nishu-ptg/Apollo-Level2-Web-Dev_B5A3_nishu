import { Response } from "express";

export const sendSuccess = <T>(
  res: Response,
  message: string,
  data: T,
  status: number = 200
) => {
  return res.status(status).json({
    success: true,
    message,
    data,
  });
};

export const sendError = (
  res: Response,
  message: string,
  status: number = 500,
  error: any = null
) => {
  return res.status(status).json({
    success: false,
    message,
    error,
  });
};
