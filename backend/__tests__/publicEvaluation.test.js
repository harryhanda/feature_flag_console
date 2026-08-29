require("./setup");
const request = require("supertest");
const app = require("../app");
const { createUserAndLogin } = require("./helpers");
const { isInRollout } = require("../utils/rollout");

describe("Public feature evaluation", () => {
  test("public endpoint requires no auth and hides internal fields", async () => {
    const { token } = await createUserAndLogin(app, { email: "admin3@example.com", role: "admin" });
    await request(app)
      .post("/api/features")
      .set("Authorization", `Bearer ${token}`)
      .send({ name: "premiumBanner", enabled: true, rollout: 100 });

    const res = await request(app).get("/api/public/features");
    expect(res.status).toBe(200);
    expect(res.body.data[0]).toEqual({ name: "premiumBanner", enabled: true });
    // internal fields must never leak
    expect(res.body.data[0]._id).toBeUndefined();
    expect(res.body.data[0].createdBy).toBeUndefined();
  });

  test("disabled feature evaluates to false regardless of rollout", async () => {
    const { token } = await createUserAndLogin(app, { email: "admin4@example.com", role: "admin" });
    await request(app)
      .post("/api/features")
      .set("Authorization", `Bearer ${token}`)
      .send({ name: "offFlag", enabled: false, rollout: 100 });

    const res = await request(app).get("/api/public/features/offFlag");
    expect(res.body.data.enabled).toBe(false);
  });

  test("404 for unknown feature name", async () => {
    const res = await request(app).get("/api/public/features/doesNotExist");
    expect(res.status).toBe(404);
  });
});

describe("Deterministic rollout", () => {
  test("same feature + same bucket key always returns the same result", () => {
    const results = new Set();
    for (let i = 0; i < 20; i++) {
      results.add(isInRollout("myFeature", "user-123", 40));
    }
    expect(results.size).toBe(1); // always the same answer
  });

  test("0% rollout is always false, 100% is always true", () => {
    expect(isInRollout("f", "user-a", 0)).toBe(false);
    expect(isInRollout("f", "user-b", 100)).toBe(true);
  });

  test("roughly matches target percentage across many users", () => {
    let inCount = 0;
    const total = 2000;
    for (let i = 0; i < total; i++) {
      if (isInRollout("spreadFeature", `user-${i}`, 30)) inCount++;
    }
    const pct = (inCount / total) * 100;
    expect(pct).toBeGreaterThan(24);
    expect(pct).toBeLessThan(36);
  });
});
