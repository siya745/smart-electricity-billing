// routes/auth.js
const router = require("express").Router();
const db     = require("../db");

// POST /api/auth/login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ error: "email and password are required" });

    const [rows] = await db.query("users", "findOne", { where: { email } });
    const user   = rows[0];

    if (!user || user.password !== password)
      return res.status(401).json({ error: "Invalid email or password" });

    const { password: _pw, ...safeUser } = user;
    res.json({ message: "Login successful", user: safeUser });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// POST /api/auth/register
router.post("/register", async (req, res) => {
  try {
    const { name, email, phone, address, meter_number, password = "pass123" } = req.body;
    if (!name || !email)
      return res.status(400).json({ error: "name and email are required" });

    const [existing] = await db.query("users", "findOne", { where: { email } });
    if (existing[0])
      return res.status(409).json({ error: "Email already registered" });

    const [result] = await db.query("users", "insert", {
      data: {
        name, email, phone, address, meter_number,
        password,
        role:       "customer",
        created_at: new Date().toISOString().split("T")[0],
      },
    });
    res.status(201).json({ id: result.insertId, message: "Registered successfully" });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

module.exports = router;