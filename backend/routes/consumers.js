// routes/users.js
const router = require("express").Router();
const db     = require("../db");

// GET /api/users          — all users (optional ?role=customer)
router.get("/", async (req, res) => {
  try {
    const where = req.query.role ? { role: req.query.role } : undefined;
    const [rows] = await db.query("users", "findAll", { where });
    res.json(rows.map(({ password, ...u }) => u));
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// GET /api/users/:id
router.get("/:id", async (req, res) => {
  try {
    const [rows] = await db.query("users", "findOne", { where: { id: +req.params.id } });
    if (!rows[0]) return res.status(404).json({ error: "User not found" });
    const { password, ...u } = rows[0];
    res.json(u);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// POST /api/users  — create
router.post("/", async (req, res) => {
  try {
    const { name, email, phone, address, meter_number, password = "pass123", role = "customer" } = req.body;
    if (!name || !email) return res.status(400).json({ error: "name and email required" });
    const [result] = await db.query("users", "insert", {
      data: { name, email, phone, address, meter_number, password, role,
              created_at: new Date().toISOString().split("T")[0] },
    });
    res.status(201).json({ id: result.insertId, message: "User created" });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// PUT /api/users/:id
router.put("/:id", async (req, res) => {
  try {
    const { name, email, phone, address, meter_number } = req.body;
    await db.query("users", "update", {
      where: { id: +req.params.id },
      data:  { name, email, phone, address, meter_number },
    });
    res.json({ message: "User updated" });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// DELETE /api/users/:id
router.delete("/:id", async (req, res) => {
  try {
    await db.query("users", "delete", { where: { id: +req.params.id } });
    res.json({ message: "User deleted" });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// GET /api/users/meter/:meter_number
router.get("/meter/:meter_number", async (req, res) => {
  try {
    const [rows] = await db.query("users", "findOne", { where: { meter_number: req.params.meter_number } });
    if (!rows[0]) return res.status(404).json({ error: "Meter not found" });
    const { password, ...u } = rows[0];
    res.json(u);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

module.exports = router;