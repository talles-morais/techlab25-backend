import { ErrorRequestHandler, Request, Response, NextFunction } from "express";
import { HttpError } from "../utils/http-error";
import config from "../config/config";

export const errorHandlerMiddleware: ErrorRequestHandler = (
  error: unknown,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (res.headersSent || config.debug) {
    next(error);
    return;
  }

  if (error instanceof HttpError) {
    res.status(error.statusCode).json({ message: error.message });
  } else if (error instanceof Error) {
    res.status(500).json({ message: error.message });
  } else {
    res.status(500).json({ message: "unknown internal error" });
  }
};
