import { Router } from "express";
import { TaskController } from "../controllers/task.controller";
import { authenticate } from "../middleware/auth.middleware";
import { validate } from "../middleware/validate.middleware";
import { CreateTaskSchema, UpdateTaskSchema } from "../schemas/task";

const router = Router();

router.use(authenticate as any);

// Project-specific task routes
router.get("/projects/:projectId/tasks", TaskController.list as any);
router.post("/projects/:projectId/tasks", validate(CreateTaskSchema), TaskController.create as any);
router.get("/projects/:projectId/stats", TaskController.stats as any);

// Individual task routes
router.patch("/tasks/:id", validate(UpdateTaskSchema), TaskController.update as any);
router.delete("/tasks/:id", TaskController.remove as any);

export default router;
