// routes/payments.js
const router = require("express").Router();
const db     = require("../db");

// GET /api/payments             — all payments
// GET /api/payments?user_id=1
router.get("/", async (req, res) => {
  try {
    const where = req.query.user_id ? { user_id: +req.query.user_id } : undefined;
    const [payments] = await db.query("payments", "findAll", { where, orderBy: "payment_date" });

    const [users] = await db.query("users", "findAll");
    const userMap = Object.fromEntries(users.map(u => [u.id, u.name]));
    res.json(payments.map(p => ({ ...p, customer_name: userMap[p.user_id] || "Unknown" })));
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// GET /api/payments/:id
router.get("/:id", async (req, res) => {
  try {
    const [rows] = await db.query("payments", "findOne", { where: { id: +req.params.id } });
    if (!rows[0]) return res.status(404).json({ error: "Payment not found" });
    res.json(rows[0]);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// POST /api/payments  — record payment + auto-mark bill as paid
router.post("/", async (req, res) => {
  try {
    const { bill_id, user_id, amount, payment_mode = "Cash" } = req.body;
    if (!bill_id || !user_id || !amount)
      return res.status(400).json({ error: "bill_id, user_id, and amount are required" });

    const txnId = "TXN" + Date.now();
    const [result] = await db.query("payments", "insert", {
      data: {
        bill_id:        +bill_id,
        user_id:        +user_id,
        amount:         +amount,
        payment_date:   today(),
        payment_mode,
        transaction_id: txnId,
      },
    });

    // automatically flip the bill to paid
    await db.query("bills", "update", { where: { id: +bill_id }, data: { status: "paid" } });

    res.status(201).json({ id: result.insertId, transaction_id: txnId, message: "Payment recorded" });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// DELETE /api/payments/:id  (admin)
router.delete("/:id", async (req, res) => {
  try {
    await db.query("payments", "delete", { where: { id: +req.params.id } });
    res.json({ message: "Payment deleted" });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

function today() { return new Date().toISOString().split("T")[0]; }
module.exports = router;