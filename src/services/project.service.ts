import db from "../lib/db";
import { CreateProjectInput, UpdateProjectInput } from "../schemas/project";
import { NotFoundError, ForbiddenError } from "../lib/errors";

export class ProjectService {
  static async getProjects(userId: string, page: number = 1, limit: number = 10) {
    const offset = (page - 1) * limit;

    const projectsQuery = db("projects")
      .where("owner_id", userId)
      .orWhereExists(function () {
        this.select("*")
          .from("tasks")
          .whereRaw("tasks.project_id = projects.id")
          .andWhere("tasks.assignee_id", userId);
      })
      .limit(limit)
      .offset(offset)
      .orderBy("projects.created_at", "desc");

    const countQuery = db("projects")
      .where("owner_id", userId)
      .orWhereExists(function () {
        this.select("*")
          .from("tasks")
          .whereRaw("tasks.project_id = projects.id")
          .andWhere("tasks.assignee_id", userId);
      })
      .count("projects.id as total")
      .first();

    const [projects, count] = await Promise.all([projectsQuery, countQuery]);

    return {
      data: projects,
      pagination: {
        page,
        limit,
        total: parseInt(count?.total as string) || 0,
      },
    };
  }

  static async hasAccess(projectId: string, userId: string) {
    const project = await db("projects").where({ id: projectId }).first();
    if (!project) return null;

    if (project.owner_id === userId) return project;

    const assignedTask = await db("tasks")
      .where({ project_id: projectId, assignee_id: userId })
      .first();

    if (assignedTask) return project;

    return null;
  }

  static async getProjectById(id: string, userId: string) {
    const project = await this.hasAccess(id, userId);

    if (project === null) {
      // Check if project exists at all to return 404 vs 403
      const exists = await db("projects").where({ id }).first();
      if (!exists) throw new NotFoundError("Project not found");
      throw new ForbiddenError("You do not have access to this project");
    }

    return project;
  }


  static async createProject(data: CreateProjectInput, userId: string) {
    const [project] = await db("projects")
      .insert({
        ...data,
        owner_id: userId,
      })
      .returning("*");

    return project;
  }

  static async updateProject(id: string, data: UpdateProjectInput, userId: string) {
    const project = await db("projects").where({ id }).first();

    if (!project) {
      throw new NotFoundError("Project not found");
    }

    if (project.owner_id !== userId) {
      throw new ForbiddenError("Only the owner can update this project");
    }

    const [updatedProject] = await db("projects")
      .where({ id })
      .update(data)
      .returning("*");

    return updatedProject;
  }

  static async deleteProject(id: string, userId: string) {
    const project = await db("projects").where({ id }).first();

    if (!project) {
      throw new NotFoundError("Project not found");
    }

    if (project.owner_id !== userId) {
      throw new ForbiddenError("Only the owner can delete this project");
    }

    await db("projects").where({ id }).del();
  }
}
