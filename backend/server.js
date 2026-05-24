// server.js
require("dotenv").config();

const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors({
  origin: process.env.CLIENT_URL || "*"
}));

app.use(express.json());
// Dashboard stats
app.get("/api/dashboard/stats", (req, res) => {
  res.json({
    totalConsumers: 24,
    totalBills: 56,
    paidBills: 38,
    pendingBills: 18,
    totalRevenue: 84500,
    monthlyUsage: 12450
  });
});
// ================= ROUTES =================

// Users / Consumers
app.use("/api/users", require("./routes/users"));
app.use("/api/consumers", require("./routes/users"));

// Bills
app.use("/api/bills", require("./routes/bills"));

// Payments
app.use("/api/payments", require("./routes/payments"));

// Meter readings
app.use("/api/readings", require("./routes/readings"));

// Auth
app.use("/api/auth", require("./routes/auth"));

// ================= ROOT =================

app.get("/", (req, res) => {
  res.json({
    message: "⚡ Electricity Billing API Running",
    database: "Local JSON DB"
  });
});

// ================= 404 =================

app.use((req, res) => {
  res.status(404).json({
    error: "Route not found"
  });
});

// ================= SERVER =================

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀  Server → http://localhost:${PORT}`);
});