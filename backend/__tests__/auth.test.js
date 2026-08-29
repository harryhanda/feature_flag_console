require("./setup");
const request = require("supertest");
const app = require("../app");

describe("Auth", () => {
  const email = "harry@example.com";
  const password = "password123";

  test("registers a new user as viewer", async () => {
    const res = await request(app).post("/api/auth/register").send({ email, password });
    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.role).toBe("viewer");
  });

  test("rejects duplicate email registration", async () => {
    await request(app).post("/api/auth/register").send({ email, password });
    const res = await request(app).post("/api/auth/register").send({ email, password });
    expect(res.status).toBe(409);
    expect(res.body.success).toBe(false);
  });

  test("logs in with correct credentials and returns a JWT", async () => {
    await request(app).post("/api/auth/register").send({ email, password });
    const res = await request(app).post("/api/auth/login").send({ email, password });
    expect(res.status).toBe(200);
    expect(res.body.data.token).toBeDefined();
    expect(res.body.data.user.email).toBe(email);
  });

  test("rejects invalid password", async () => {
    await request(app).post("/api/auth/register").send({ email, password });
    const res = await request(app)
      .post("/api/auth/login")
      .send({ email, password: "wrongpassword" });
    expect(res.status).toBe(401);
    expect(res.body.success).toBe(false);
  });

  test("rejects login for unknown user", async () => {
    const res = await request(app)
      .post("/api/auth/login")
      .send({ email: "nobody@example.com", password: "whatever1" });
    expect(res.status).toBe(401);
  });

  test("protected route rejects requests with no token", async () => {
    const res = await request(app).get("/api/users");
    expect(res.status).toBe(401);
  });
});
