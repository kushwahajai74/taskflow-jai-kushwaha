import express from "express";
import authRoutes from "./routes/auth.routes";
import projectRoutes from "./routes/project.routes";
import taskRoutes from "./routes/task.routes";
import { errorHandler } from "./middleware/error.middleware";

const app = express();

app.use(express.json());

app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

app.use("/auth", authRoutes);
app.use("/projects", projectRoutes);
app.use("/", taskRoutes);

app.use(errorHandler);

export default app;
