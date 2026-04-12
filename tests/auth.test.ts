import request from "supertest";
import app from "../src/app";
import db from "../src/lib/db";

const TEST_EMAIL = `test_auth_${Date.now()}@example.com`;
const TEST_PASSWORD = "password123";
const TEST_NAME = "Test User";

describe("Auth Integration Tests", () => {
  afterAll(async () => {
    await db("users").where({ email: TEST_EMAIL }).delete();
    await db.destroy();
  });

  /**
   * Test 1: Register a new user with valid data.
   * Expects 201 with user object (no password) and a JWT token.
   */
  it("should register a new user successfully", async () => {
    const res = await request(app)
      .post("/auth/register")
      .send({ name: TEST_NAME, email: TEST_EMAIL, password: TEST_PASSWORD });

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty("token");
    expect(res.body.user).toMatchObject({ name: TEST_NAME, email: TEST_EMAIL });
    expect(res.body.user).not.toHaveProperty("password");
  });

  /**
   * Test 2: Login with valid credentials after registration.
   * Expects 200 with a JWT token and the user's email in the response.
   */
  it("should login with valid credentials", async () => {
    const res = await request(app)
      .post("/auth/login")
      .send({ email: TEST_EMAIL, password: TEST_PASSWORD });

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("token");
    expect(res.body.user).toMatchObject({ email: TEST_EMAIL });
    expect(res.body.user).not.toHaveProperty("password");
  });

  /**
   * Test 3: Attempt to register with an already-registered email.
   * Expects 400 with a validation error on the email field.
   */
  it("should reject registration with a duplicate email", async () => {
    const res = await request(app)
      .post("/auth/register")
      .send({ name: TEST_NAME, email: TEST_EMAIL, password: TEST_PASSWORD });

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty("fields");
    expect(res.body.fields).toHaveProperty("email");
  });
});
