// routes/meters.js — All Meter API endpoints
const express = require("express");
const router = express.Router();
const pool = require("../db");

// ── GET /meters ────────────────────────────────────────────────────────────────
// Returns all meters with consumer name joined
router.get("/", async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT m.*, c.name AS consumer_name
      FROM meter m
      JOIN consumer c ON m.consumer_id = c.consumer_id
      ORDER BY m.meter_id
    `);
    res.json(rows);
  } catch (err) {
    console.error("GET /meters error:", err);
    res.status(500).json({ error: err.message });
  }
});

// ── GET /meters/by-consumer/:consumer_id ──────────────────────────────────────
// Returns all meters belonging to a specific consumer
router.get("/by-consumer/:consumer_id", async (req, res) => {
  try {
    const [rows] = await pool.query(
      "SELECT * FROM meter WHERE consumer_id = ? ORDER BY meter_id",
      [req.params.consumer_id]
    );
    res.json(rows);
  } catch (err) {
    console.error("GET /meters/by-consumer error:", err);
    res.status(500).json({ error: err.message });
  }
});

// ── POST /meters ───────────────────────────────────────────────────────────────
// Creates a new meter linked to a consumer
router.post("/", async (req, res) => {
  const { meter_id, installation_date, status, consumer_id } = req.body;

  if (!meter_id || !consumer_id) {
    return res.status(400).json({ error: "meter_id and consumer_id are required" });
  }

  try {
    await pool.query(
      "INSERT INTO meter (meter_id, installation_date, status, consumer_id) VALUES (?, ?, ?, ?)",
      [meter_id, installation_date || new Date(), status || "Active", consumer_id]
    );
    res.status(201).json({ message: "Meter created successfully", meter_id });
  } catch (err) {
    console.error("POST /meters error:", err);
    if (err.code === "ER_DUP_ENTRY") {
      return res.status(409).json({ error: "Meter ID already exists" });
    }
    if (err.code === "ER_NO_REFERENCED_ROW_2") {
      return res.status(400).json({ error: "Consumer not found" });
    }
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
