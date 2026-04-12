import { Response, NextFunction } from "express";
import { AuthRequest } from "../middleware/auth.middleware";
import { TaskService } from "../services/task.service";
import { TaskFilterSchema } from "../schemas/task";

export class TaskController {
  static async list(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { projectId } = req.params;
      const filters = TaskFilterSchema.parse(req.query);
      const userId = req.user!.user_id;

      const tasks = await TaskService.getTasks(projectId, filters, userId);
      return res.status(200).json(tasks);
    } catch (error) {
      next(error);
    }
  }

  static async create(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { projectId } = req.params;
      const userId = req.user!.user_id;

      const task = await TaskService.createTask(projectId, req.body, userId);
      return res.status(201).json(task);
    } catch (error) {
      next(error);
    }
  }

  static async update(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const userId = req.user!.user_id;

      const task = await TaskService.updateTask(id, req.body, userId);
      return res.status(200).json(task);
    } catch (error) {
      next(error);
    }
  }

  static async remove(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const userId = req.user!.user_id;

      await TaskService.deleteTask(id, userId);
      return res.status(204).end();
    } catch (error) {
      next(error);
    }
  }

  static async stats(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { projectId } = req.params;
      const userId = req.user!.user_id;

      const stats = await TaskService.getProjectStats(projectId, userId);
      return res.status(200).json(stats);
    } catch (error) {
      next(error);
    }
  }
}
