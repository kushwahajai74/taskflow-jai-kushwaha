import db from "../lib/db";
import { CreateTaskInput, UpdateTaskInput, TaskFilterInput } from "../schemas/task";
import { NotFoundError, ForbiddenError } from "../lib/errors";
import { ProjectService } from "./project.service";

export class TaskService {
  static async verifyProjectAccess(projectId: string, userId: string) {
    const project = await ProjectService.hasAccess(projectId, userId);

    if (project === null) {
      const exists = await db("projects").where({ id: projectId }).first();
      if (!exists) throw new NotFoundError("Project not found");
      throw new ForbiddenError("You do not have access to this project");
    }

    return project;
  }


  static async getTasks(projectId: string, filters: TaskFilterInput, userId: string) {
    await this.verifyProjectAccess(projectId, userId);

    const query = db("tasks").where({ project_id: projectId });

    if (filters.status) {
      query.where("status", filters.status);
    }
    if (filters.assignee_id) {
      query.where("assignee_id", filters.assignee_id);
    }

    return query.orderBy("created_at", "desc");
  }

  static async createTask(projectId: string, data: CreateTaskInput, userId: string) {
    await this.verifyProjectAccess(projectId, userId);

    const [task] = await db("tasks")
      .insert({
        ...data,
        project_id: projectId,
      })
      .returning("*");

    return task;
  }

  static async updateTask(taskId: string, data: UpdateTaskInput, userId: string) {
    const task = await db("tasks").where({ id: taskId }).first();
    if (!task) {
      throw new NotFoundError("Task not found");
    }

    await this.verifyProjectAccess(task.project_id, userId);

    const [updatedTask] = await db("tasks")
      .where({ id: taskId })
      .update({
        ...data,
        updated_at: db.fn.now(),
      })
      .returning("*");

    return updatedTask;
  }

  static async deleteTask(taskId: string, userId: string) {
    const task = await db("tasks").where({ id: taskId }).first();
    if (!task) {
      throw new NotFoundError("Task not found");
    }

    const project = await db("projects").where({ id: task.project_id }).first();
    if (!project || project.owner_id !== userId) {
      throw new ForbiddenError("Only the project owner can delete tasks");
    }

    await db("tasks").where({ id: taskId }).del();
  }

  static async getProjectStats(projectId: string, userId: string) {
    await this.verifyProjectAccess(projectId, userId);

    const statusStats = await db("tasks")
      .where({ project_id: projectId })
      .select("status")
      .count("id as count")
      .groupBy("status");

    const assigneeStats = await db("tasks")
      .where({ project_id: projectId })
      .select("assignee_id")
      .count("id as count")
      .groupBy("assignee_id");

    return {
      by_status: statusStats,
      by_assignee: assigneeStats,
    };
  }
}
