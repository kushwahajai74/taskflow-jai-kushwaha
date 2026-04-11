import { Response, NextFunction } from "express";
import { AuthRequest } from "../middleware/auth.middleware";
import { ProjectService } from "../services/project.service";

export class ProjectController {
  static async list(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const userId = req.user!.user_id;

      const result = await ProjectService.getProjects(userId, page, limit);
      return res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  static async get(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const userId = req.user!.user_id;

      const project = await ProjectService.getProjectById(id, userId);
      return res.status(200).json(project);
    } catch (error) {
      next(error);
    }
  }

  static async create(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.user_id;
      const project = await ProjectService.createProject(req.body, userId);
      return res.status(201).json(project);
    } catch (error) {
      next(error);
    }
  }

  static async update(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const userId = req.user!.user_id;

      const project = await ProjectService.updateProject(id, req.body, userId);
      return res.status(200).json(project);
    } catch (error) {
      next(error);
    }
  }

  static async remove(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const userId = req.user!.user_id;

      await ProjectService.deleteProject(id, userId);
      return res.status(204).end();
    } catch (error) {
      next(error);
    }
  }
}
