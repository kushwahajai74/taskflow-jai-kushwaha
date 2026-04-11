import { Router } from "express";
import { ProjectController } from "../controllers/project.controller";
import { authenticate } from "../middleware/auth.middleware";
import { validate } from "../middleware/validate.middleware";
import { CreateProjectSchema, UpdateProjectSchema } from "../schemas/project";

const router = Router();

router.use(authenticate as any);

router.get("/", ProjectController.list as any);
router.get("/:id", ProjectController.get as any);
router.post("/", validate(CreateProjectSchema), ProjectController.create as any);
router.patch("/:id", validate(UpdateProjectSchema), ProjectController.update as any);
router.delete("/:id", ProjectController.remove as any);

export default router;
