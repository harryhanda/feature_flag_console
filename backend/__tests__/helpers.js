const request = require("supertest");
const app = require("../app");
const User = require("../models/User");

// Creates a user directly in the DB with a chosen role (bypassing the
// public register endpoint, which always assigns "viewer"), then logs in
// to get a real JWT for use in test requests.
async function createUserAndLogin(app_, { email, password = "password123", role = "viewer" }) {
  await User.create({ email, password, role });
  const res = await request(app_).post("/api/auth/login").send({ email, password });
  return { token: res.body.data.token, user: res.body.data.user };
}

module.exports = { createUserAndLogin, app };
