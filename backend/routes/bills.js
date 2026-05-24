// routes/bills.js
const router = require("express").Router();
const db     = require("../db");

// GET /api/bills              — all bills
// GET /api/bills?user_id=1   — bills for one user
// GET /api/bills?status=unpaid
router.get("/", async (req, res) => {
  try {
    const where = {};
    if (req.query.user_id) where.user_id = +req.query.user_id;
    if (req.query.status)  where.status  = req.query.status;

    const [bills] = await db.query("bills", "findAll", {
      where: Object.keys(where).length ? where : undefined,
      orderBy: "bill_date",
    });

    const [users] = await db.query("users", "findAll");
    const userMap = Object.fromEntries(users.map(u => [u.id, u.name]));
    res.json(bills.map(b => ({ ...b, customer_name: userMap[b.user_id] || "Unknown" })));
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// GET /api/bills/summary/stats  — dashboard numbers
// NOTE: this route must be declared BEFORE /:id
router.get("/summary/stats", async (req, res) => {
  try {
    const [bills]    = await db.query("bills",    "findAll");
    const [users]    = await db.query("users",    "findAll", { where: { role: "customer" } });
    const [payments] = await db.query("payments", "findAll");

    const totalRevenue = payments.reduce((s, p) => s + p.amount, 0);
    const unpaidBills  = bills.filter(b => b.status === "unpaid").length;
    const paidBills    = bills.filter(b => b.status === "paid").length;

    res.json({ totalCustomers: users.length, totalBills: bills.length, paidBills, unpaidBills, totalRevenue });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// GET /api/bills/:id
router.get("/:id", async (req, res) => {
  try {
    const [rows] = await db.query("bills", "findOne", { where: { id: +req.params.id } });
    if (!rows[0]) return res.status(404).json({ error: "Bill not found" });
    res.json(rows[0]);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// POST /api/bills  — generate new bill
router.post("/", async (req, res) => {
  try {
    const { user_id, units_consumed, rate_per_unit = 6.5, due_date, meter_reading_id } = req.body;
    if (!user_id || !units_consumed) return res.status(400).json({ error: "user_id and units_consumed required" });

    const amount = +(units_consumed * rate_per_unit).toFixed(2);
    const [result] = await db.query("bills", "insert", {
      data: {
        user_id: +user_id,
        meter_reading_id: meter_reading_id || null,
        units_consumed: +units_consumed,
        rate_per_unit,
        amount,
        due_date: due_date || futureDate(30),
        status: "unpaid",
        bill_date: today(),
      },
    });
    res.status(201).json({ id: result.insertId, amount, message: "Bill generated" });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// PUT /api/bills/:id  — update any field
router.put("/:id", async (req, res) => {
  try {
    await db.query("bills", "update", { where: { id: +req.params.id }, data: req.body });
    res.json({ message: "Bill updated" });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// PATCH /api/bills/:id/pay  — quick mark-as-paid shortcut
router.patch("/:id/pay", async (req, res) => {
  try {
    await db.query("bills", "update", { where: { id: +req.params.id }, data: { status: "paid" } });
    res.json({ message: "Bill marked as paid" });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// DELETE /api/bills/:id
router.delete("/:id", async (req, res) => {
  try {
    await db.query("bills", "delete", { where: { id: +req.params.id } });
    res.json({ message: "Bill deleted" });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

function today()          { return new Date().toISOString().split("T")[0]; }
function futureDate(days) { const d = new Date(); d.setDate(d.getDate() + days); return d.toISOString().split("T")[0]; }
module.exports = router;