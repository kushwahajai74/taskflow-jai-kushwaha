import type { Knex } from "knex";
import bcrypt from "bcrypt";

const USER_ID = "00000000-0000-0000-0000-000000000001";
const PROJECT_ID = "00000000-0000-0000-0000-000000000002";

export async function up(knex: Knex): Promise<void> {
  const hashedPassword = await bcrypt.hash("password123", 12);

  await knex("users").insert({
    id: USER_ID,
    name: "Demo User",
    email: "demo@taskflow.com",
    password: hashedPassword,
  });

  await knex("projects").insert({
    id: PROJECT_ID,
    name: "Demo Project",
    description: "A sample project created by the seed migration.",
    owner_id: USER_ID,
  });

  await knex("tasks").insert([
    {
      title: "Set up the repository",
      description: "Clone the repo and configure environment variables.",
      status: "done",
      priority: "high",
      project_id: PROJECT_ID,
      assignee_id: USER_ID,
    },
    {
      title: "Implement authentication",
      description: "Build register and login endpoints with JWT.",
      status: "in_progress",
      priority: "high",
      project_id: PROJECT_ID,
      assignee_id: USER_ID,
    },
    {
      title: "Write API documentation",
      description: "Document all endpoints with request/response examples.",
      status: "todo",
      priority: "medium",
      project_id: PROJECT_ID,
      assignee_id: USER_ID,
    },
  ]);
}

export async function down(knex: Knex): Promise<void> {
  await knex("tasks").where({ project_id: PROJECT_ID }).delete();
  await knex("projects").where({ id: PROJECT_ID }).delete();
  await knex("users").where({ id: USER_ID }).delete();
}
