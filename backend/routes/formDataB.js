const express = require("express");
const router = express.Router();
const FormDataB = require("../models/FormDataB");

// Import shared delete module
const deleteFormData = require("./deleteFormData");

// Attach delete routes (must be BEFORE module.exports)
deleteFormData(router, FormDataB);

// -----------------------------------------
// CREATE
// -----------------------------------------
router.post("/", async (req, res) => {
  try {
    const data = await FormDataB.create(req.body);
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
    const data = await FormDataB.find().sort({ createdAt: -1 });
    res.json(data);
  } catch (err) {
    console.error("Error fetching reports:", err);
    res.status(500).json({ message: "Failed to fetch reports" });
  }
});

module.exports = router;
