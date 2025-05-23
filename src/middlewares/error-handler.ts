import { ErrorRequestHandler, Request, Response, NextFunction } from "express";
import { HttpError } from "../utils/http-error";
import config from "../config/config";
import { ZodError } from "zod";

export const errorHandlerMiddleware: ErrorRequestHandler = (
  error: unknown,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  if (res.headersSent || config.debug) {
    next(error);
    return;
  }

  if (error instanceof ZodError) {
    res.status(400).json({ errors: error.errors });
    return;
  } else if (error instanceof HttpError) {
    res.status(error.statusCode).json({ message: error.message });
    return;
  } else if (error instanceof Error) {
    res.status(500).json({ message: error.message });
    return;
  } else {
    res.status(500).json({ message: "unknown internal error" });
    return;
  }
};
