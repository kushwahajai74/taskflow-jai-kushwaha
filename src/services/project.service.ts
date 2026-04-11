import db from "../lib/db";
import { CreateProjectInput, UpdateProjectInput } from "../schemas/project";
import { NotFoundError, ForbiddenError } from "../lib/errors";

export class ProjectService {
  static async getProjects(userId: string, page: number = 1, limit: number = 10) {
    const offset = (page - 1) * limit;

    // List projects current user owns
    // According to requirement: List projects the current user owns or has tasks in.
    // We'll refine this as we add tasks, for now projects owned by user.
    const projectsQuery = db("projects")
      .where("owner_id", userId)
      .limit(limit)
      .offset(offset)
      .orderBy("created_at", "desc");

    const countQuery = db("projects")
      .where("owner_id", userId)
      .count("id as total")
      .first();

    const [projects, count] = await Promise.all([projectsQuery, countQuery]);

    return {
      projects,
      pagination: {
        page,
        limit,
        total: parseInt(count?.total as string) || 0,
      },
    };
  }

  static async getProjectById(id: string, userId: string) {
    const project = await db("projects").where({ id }).first();

    if (!project) {
      throw new NotFoundError("Project not found");
    }

    if (project.owner_id !== userId) {
      // Also check if user has tasks in this project (future)
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
