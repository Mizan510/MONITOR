// server.js
const express = require("express");
const cors = require("cors");
require("dotenv").config();
const connectDB = require("./config/db");

const app = express();

// Middlewares
app.use(express.json()); // Parse JSON bodies
app.use(cors()); // Enable CORS

// Connect database
connectDB();

// Test route
app.get("/", (req, res) => {
  res.send("Backend is running...");
});
// Add this after connecting database
app.use("/api/form-dataa", require("./routes/formDataA"));
app.use("/api/form-datab", require("./routes/formDataB"));
app.use("/api/form-datac", require("./routes/formDataC"));
app.use("/api/form-datad", require("./routes/formDataD"));
app.use("/api/form-datae", require("./routes/formDataE"));
app.use("/api/form-datan", require("./routes/formDataN"));

// API routes
try {
  app.use("/api/auth", require("./routes/auth"));
  console.log("Auth routes loaded successfully");
} catch (err) {
  console.error("Failed to load /routes/auth:", err);
  app.use("/api/auth", (req, res) =>
    res
      .status(500)
      .json({ message: "Auth route failed to load. See server log." })
  );
}

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
