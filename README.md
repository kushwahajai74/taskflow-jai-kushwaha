# Taskflow Backend

## 1. Overview
Taskflow is a production-ready task management backend designed to handle relational data with strict ownership and access controls. It isn't just a CRUD demo; it's built with a focus on security, structured logging, and scalability.

**Tech Stack:**
*   **Runtime:** Node.js (TypeScript)
*   **Framework:** Express
*   **Database:** PostgreSQL
*   **Query Builder:** Knex.js
*   **Authentication:** JWT with Bcrypt password hashing
*   **Validation:** Zod
*   **Logging:** Pino (High-performance structured logging)

## 2. Architecture Decisions
*   **Service-Based Pattern:** I moved business logic into a `services/` layer. This keeps controllers thin and ensures the core logic (like ownership checks) can be reused across different entry points or tests.
*   **Centralized Error Handling:** Instead of scattered `try/catch` blocks sending custom responses, I implemented a Global Error Middleware and custom `ApiError` classes. This ensures every error—from a 404 to a database failure—returns a consistent JSON structure.
*   **Knex.js over Prisma:** While Prisma is popular, I chose Knex.js to provide finer control over SQL queries and migrations, which is often preferred in performance-critical or highly customized relational setups.
*   **Hybrid Access Control:** I intentionally expanded the permission model. In Taskflow, you don't just see what you own; you see what you are *part of*. Access is granted if you are the project owner OR if you have at least one task assigned to you in that project.

## 3. Running Locally
The easiest way to get the app running is via Docker. You only need a PostgreSQL connection string (Neon DB is recommended).

```bash
# 1. Clone the repository
git clone https://github.com/kushwahajai74/taskflow-jai-kushwaha.git
cd taskflow-jai-kushwaha

# 2. Setup environment variables
cp .env.example .env
# Edit .env and add your DATABASE_URL and JWT_SECRET

# 3. Spin up the container
docker compose up --build
```
**App available at:** `http://localhost:3000`

## 4. Running Migrations
The Docker setup uses a `docker-entrypoint.sh` script that **automatically runs migrations** every time the container starts. 

If you need to run them manually outside of Docker:
```bash
npm run migrate
```

## 5. Test Credentials
The database is pre-seeded with a demo user and sample project via the `seed_demo_data` migration:

*   **Email:** `demo@taskflow.com`
*   **Password:** `password123`

## 6. API Reference
Full interactive docs: **[Postman Collection](https://documenter.getpostman.com/view/28252521/2sBXitDnb1)**


### Authentication
*   `POST /auth/register` - Register a new account.
*   `POST /auth/login` - Returns a JWT access token.

### Projects
*   `GET /projects` - List projects you own or are assigned to (supports `?page=` and `?limit=`).
*   `POST /projects` - Create a new project.
*   `GET /projects/:id` - Get project details.
*   `PATCH /projects/:id` - Update project (Owner only).
*   `DELETE /projects/:id` - Delete project and tasks (Owner only).

### Tasks & Analytics
*   `GET /projects/:projectId/tasks` - List tasks with `?status=` and `?assignee_id=` filters.
*   `POST /projects/:projectId/tasks` - Create a task.
*   `GET /projects/:projectId/stats` - Task distribution by status and assignee.
*   `PATCH /tasks/:id` - Update task details.
*   `DELETE /tasks/:id` - Delete task (Project owner only).

## 7. What You'd Do With More Time
*   **Refresh Tokens:** Currently, JWTs expire in 24 hours. I'd implement a refresh token rotation strategy for better security and user experience.
*   **Advanced Role-Based Access (RBAC):** While we have owner/assignee checks, a full "Editor/Viewer" role system would be the next logical step for a real product.
*   **Integration Testing Coverage:** I've implemented the core Auth tests, but I’d expand the suite to cover complex edge cases in the Task ownership logic.
*   **In-Memory Caching:** I’d introduce Redis caching to avoid hitting the database for every request in a high-traffic environment.
