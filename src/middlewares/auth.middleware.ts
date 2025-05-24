import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { HttpError } from "../utils/http-error";
import config from "../config/config";

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
      };
    }
  }
}

export function authMiddleware() {
  return async function (req: Request, res: Response, next: NextFunction) {
    const token = req.cookies.token;
    const jwt_secret = config.jwt.secret;

    if (!token) {
      throw new HttpError(401, "Usuário não autorizado.");
    }

    const decoded = jwt.verify(token, jwt_secret) as jwt.JwtPayload;

    if (!decoded || !decoded.id) {
      throw new HttpError(401, "Usuário não autorizado.");
    }

    req.user = {
      id: decoded.id,
    };

    next();
  };
}
