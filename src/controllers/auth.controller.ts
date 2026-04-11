import { Request, Response, NextFunction } from "express";
import { AuthService } from "../services/auth.service";
import { ConflictError } from "../lib/errors";

export class AuthController {
  static async register(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await AuthService.registerUser(req.body);
      return res.status(201).json(result);
    } catch (error: any) {
      if (error instanceof ConflictError) {
        return res.status(400).json({
          error: "validation failed",
          fields: { email: "Email already registered" },
        });
      }
      next(error);
    }
  }

  static async login(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await AuthService.loginUser(req.body);
      return res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }
}
