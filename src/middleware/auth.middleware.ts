import { Request, Response, NextFunction } from "express";
import { verifyToken } from "../lib/auth";
import { UnauthorizedError } from "../lib/errors";

export interface AuthRequest extends Request {
  user?: {
    user_id: string;
    email: string;
  };
}

export const authenticate = (req: AuthRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return next(new UnauthorizedError());
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = verifyToken(token);
    req.user = decoded;
    next();
  } catch (error) {
    next(new UnauthorizedError());
  }
};
