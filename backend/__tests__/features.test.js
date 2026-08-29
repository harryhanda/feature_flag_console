require("./setup");
const request = require("supertest");
const app = require("../app");
const { createUserAndLogin } = require("./helpers");

describe("Feature CRUD + RBAC", () => {
  test("viewer can read features but cannot create one", async () => {
    const { token } = await createUserAndLogin(app, { email: "viewer@example.com", role: "viewer" });

    const readRes = await request(app).get("/api/features").set("Authorization", `Bearer ${token}`);
    expect(readRes.status).toBe(200);

    const createRes = await request(app)
      .post("/api/features")
      .set("Authorization", `Bearer ${token}`)
      .send({ name: "newFlag", rollout: 50 });
    expect(createRes.status).toBe(403);
  });

  test("developer can create and update but not delete", async () => {
    const { token } = await createUserAndLogin(app, { email: "dev@example.com", role: "developer" });

    const createRes = await request(app)
      .post("/api/features")
      .set("Authorization", `Bearer ${token}`)
      .send({ name: "devFlag", enabled: true, rollout: 25 });
    expect(createRes.status).toBe(201);
    const id = createRes.body.data._id;

    const updateRes = await request(app)
      .put(`/api/features/${id}`)
      .set("Authorization", `Bearer ${token}`)
      .send({ rollout: 75 });
    expect(updateRes.status).toBe(200);
    expect(updateRes.body.data.rollout).toBe(75);

    const deleteRes = await request(app)
      .delete(`/api/features/${id}`)
      .set("Authorization", `Bearer ${token}`);
    expect(deleteRes.status).toBe(403);
  });

  test("admin can delete a feature", async () => {
    const { token } = await createUserAndLogin(app, { email: "admin@example.com", role: "admin" });

    const createRes = await request(app)
      .post("/api/features")
      .set("Authorization", `Bearer ${token}`)
      .send({ name: "toDelete" });
    const id = createRes.body.data._id;

    const deleteRes = await request(app)
      .delete(`/api/features/${id}`)
      .set("Authorization", `Bearer ${token}`);
    expect(deleteRes.status).toBe(200);
  });

  test("rejects duplicate feature names", async () => {
    const { token } = await createUserAndLogin(app, { email: "admin2@example.com", role: "admin" });

    await request(app)
      .post("/api/features")
      .set("Authorization", `Bearer ${token}`)
      .send({ name: "dupFlag" });

    const res = await request(app)
      .post("/api/features")
      .set("Authorization", `Bearer ${token}`)
      .send({ name: "dupFlag" });

    expect(res.status).toBe(409);
  });

  test("unauthenticated requests cannot modify features", async () => {
    const res = await request(app).post("/api/features").send({ name: "hacked" });
    expect(res.status).toBe(401);
  });
});
