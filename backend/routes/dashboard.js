// routes/dashboard.js — Dashboard summary stats
const express = require("express");
const router = express.Router();
const pool = require("../db");

// ── GET /dashboard/stats ───────────────────────────────────────────────────────
// Returns key stats: total consumers, total revenue, pending bills count
router.get("/stats", async (req, res) => {
  try {
    // Total number of consumers
    const [[{ totalConsumers }]] = await pool.query(
      "SELECT COUNT(*) AS totalConsumers FROM consumer"
    );

    // Total revenue collected (sum of all payments)
    const [[{ totalRevenue }]] = await pool.query(
      "SELECT COALESCE(SUM(amount_paid), 0) AS totalRevenue FROM payment"
    );

    // Number of bills with Pending status
    const [[{ pendingBills }]] = await pool.query(
      "SELECT COUNT(*) AS pendingBills FROM bill WHERE payment_status = 'Pending'"
    );

    // Total number of meters
    const [[{ totalMeters }]] = await pool.query(
      "SELECT COUNT(*) AS totalMeters FROM meter"
    );

    res.json({ totalConsumers, totalRevenue, pendingBills, totalMeters });
  } catch (err) {
    console.error("GET /dashboard/stats error:", err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
