const express = require("express");
const router = express.Router();
const FormDataN = require("../models/FormDataN");

// Import shared delete module
const deleteFormData = require("./deleteFormData");

// Attach delete routes (must be BEFORE module.exports)
deleteFormData(router, FormDataN);

// -----------------------------------------
// CREATE
// -----------------------------------------
router.post("/", async (req, res) => {
  try {
    const data = await FormDataN.create(req.body);
    res.status(201).json(data);
  } catch (err) {
    console.error("Error saving form data:", err);
    res.status(500).json({ message: "Failed to save form data" });
  }
});

// -----------------------------------------
// GET ALL
// -----------------------------------------
router.get("/", async (req, res) => {
  try {
    const data = await FormDataN.find().sort({ createdAt: -1 });
    res.json(data);
  } catch (err) {
    console.error("Error fetching reports:", err);
    res.status(500).json({ message: "Failed to fetch reports" });
  }
});

module.exports = router;
