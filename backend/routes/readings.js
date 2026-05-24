// routes/readings.js
const router = require("express").Router();
const db     = require("../db");

// GET /api/readings             — all readings
// GET /api/readings?user_id=1
router.get("/", async (req, res) => {
  try {
    const where = req.query.user_id ? { user_id: +req.query.user_id } : undefined;
    const [readings] = await db.query("meter_readings", "findAll", { where, orderBy: "reading_date" });

    const [users] = await db.query("users", "findAll");
    const userMap = Object.fromEntries(users.map(u => [u.id, u.name]));
    res.json(readings.map(r => ({ ...r, customer_name: userMap[r.user_id] || "Unknown" })));
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// GET /api/readings/:id
router.get("/:id", async (req, res) => {
  try {
    const [rows] = await db.query("meter_readings", "findOne", { where: { id: +req.params.id } });
    if (!rows[0]) return res.status(404).json({ error: "Reading not found" });
    res.json(rows[0]);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// POST /api/readings  — add new meter reading
router.post("/", async (req, res) => {
  try {
    const { user_id, previous_reading, current_reading } = req.body;
    if (!user_id || current_reading == null)
      return res.status(400).json({ error: "user_id and current_reading are required" });

    const prev  = +(previous_reading || 0);
    const curr  = +current_reading;
    const units = curr - prev;
    if (units < 0) return res.status(400).json({ error: "current_reading must be >= previous_reading" });

    const [result] = await db.query("meter_readings", "insert", {
      data: {
        user_id:          +user_id,
        previous_reading: prev,
        current_reading:  curr,
        units_consumed:   units,
        reading_date:     today(),
      },
    });
    res.status(201).json({ id: result.insertId, units_consumed: units, message: "Reading saved" });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// DELETE /api/readings/:id
router.delete("/:id", async (req, res) => {
  try {
    await db.query("meter_readings", "delete", { where: { id: +req.params.id } });
    res.json({ message: "Reading deleted" });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

function today() { return new Date().toISOString().split("T")[0]; }
module.exports = router;