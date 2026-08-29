module.exports = {
  testEnvironment: "node",
  setupFiles: ["dotenv/config"],
  testPathIgnorePatterns: [
    "/node_modules/",
    "/__tests__/setup.js$",
    "/__tests__/helpers.js$"
  ]
};