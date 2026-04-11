import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable("tasks", (table) => {
    table.uuid("id").primary().defaultTo(knex.fn.uuid());
    table.string("title").notNullable();
    table.text("description");
    table
      .enum("status", ["todo", "in_progress", "done"], {
        useNative: true,
        enumName: "task_status",
      })
      .defaultTo("todo")
      .notNullable();
    table
      .enum("priority", ["low", "medium", "high"], {
        useNative: true,
        enumName: "task_priority",
      })
      .defaultTo("medium")
      .notNullable();
    table.uuid("project_id").references("id").inTable("projects").onDelete("CASCADE").notNullable();
    table.uuid("assignee_id").references("id").inTable("users").onDelete("SET NULL");
    table.timestamp("due_date");
    table.timestamp("created_at").defaultTo(knex.fn.now());
    table.timestamp("updated_at").defaultTo(knex.fn.now());
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable("tasks");
  await knex.raw('DROP TYPE IF EXISTS "task_status"');
  await knex.raw('DROP TYPE IF EXISTS "task_priority"');
}
