const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const featureRoutes = require("./routes/featureRoutes");

// Load environment variables
dotenv.config();
console.log("Mongo URI:", process.env.MONGO_URI); // Debug check

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI || "mongodb://127.0.0.1:27017/featureflags")
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.log("❌ MongoDB Error:", err));

// Basic root route
app.get("/", (req, res) => {
  console.log("✅ Root route hit");
  res.send("Feature Flag Backend is running 🚀");
});

// API Routes
app.use("/api/features", featureRoutes);

// Final port setup
const PORT = process.env.PORT || 5001;
console.log("🧠 Final Port Variable:", PORT);

// Start the server (macOS-safe binding)
app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
