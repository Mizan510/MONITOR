const express = require("express");
const cors = require("cors");
require("dotenv").config();
const connectDB = require("./config/db");

const app = express();

// ---------------------
// CORS (must be FIRST)
// ---------------------
app.use(
  cors({
    origin: [
      "https://monitor-eight-sigma.vercel.app",
      "http://localhost:5173"
    ],
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    credentials: true,
  })
);

// ---------------------
// Body parser
// ---------------------
app.use(express.json());

// ---------------------
// Connect database
// ---------------------
connectDB();

// ---------------------
// Test route
// ---------------------
app.get("/", (req, res) => {
  res.send("Backend is running...");
});

// ---------------------
// API Routes
// ---------------------
app.use("/api/auth", require("./routes/auth"));
app.use("/api/form-dataa", require("./routes/formDataA"));
app.use("/api/form-datab", require("./routes/formDataB"));
app.use("/api/form-datac", require("./routes/formDataC"));
app.use("/api/form-datad", require("./routes/formDataD"));
app.use("/api/form-datae", require("./routes/formDataE"));
app.use("/api/form-datan", require("./routes/formDataN"));

// ---------------------
// Start Server
// ---------------------
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
