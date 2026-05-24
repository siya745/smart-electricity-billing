// ============================================================
// db.js  —  Temporary local JSON database (replaces MySQL)
// To switch back to MySQL: restore original db.js + routes
// ============================================================
const fs   = require("fs");
const path = require("path");

const DATA_DIR = path.join(__dirname, "data");
if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });

// ── helpers ──────────────────────────────────────────────────
function fp(name)          { return path.join(DATA_DIR, `${name}.json`); }
function read(name)        { return fs.existsSync(fp(name)) ? JSON.parse(fs.readFileSync(fp(name), "utf8")) : []; }
function write(name, rows) { fs.writeFileSync(fp(name), JSON.stringify(rows, null, 2)); }
function nextId(rows)      { return rows.length ? Math.max(...rows.map(r => r.id)) + 1 : 1; }

// ── seed once ────────────────────────────────────────────────
function seed() {
  if (!fs.existsSync(fp("users"))) {
    write("users", [
      { id:1, name:"Ramesh Kumar",  email:"ramesh@example.com", phone:"9876543210", address:"12 MG Road, Hyderabad",      meter_number:"MTR001", password:"pass123", role:"customer", created_at:"2024-01-10" },
      { id:2, name:"Priya Sharma",  email:"priya@example.com",  phone:"9123456780", address:"45 Anna Nagar, Chennai",     meter_number:"MTR002", password:"pass123", role:"customer", created_at:"2024-02-14" },
      { id:3, name:"Anil Reddy",    email:"anil@example.com",   phone:"9988776655", address:"7 Banjara Hills, Hyderabad", meter_number:"MTR003", password:"pass123", role:"customer", created_at:"2024-03-05" },
      { id:4, name:"Sunita Patel",  email:"sunita@example.com", phone:"9001122334", address:"23 Civil Lines, Nagpur",     meter_number:"MTR004", password:"pass123", role:"customer", created_at:"2024-04-20" },
      { id:5, name:"Admin User",    email:"admin@ebill.com",    phone:"9000000000", address:"EB Office, Main Branch",     meter_number:null,     password:"admin123", role:"admin",   created_at:"2024-01-01" },
    ]);
  }

  if (!fs.existsSync(fp("meter_readings"))) {
    write("meter_readings", [
      { id:1, user_id:1, previous_reading:1200, current_reading:1450, units_consumed:250, reading_date:"2024-04-01" },
      { id:2, user_id:2, previous_reading:800,  current_reading:980,  units_consumed:180, reading_date:"2024-04-01" },
      { id:3, user_id:3, previous_reading:2100, current_reading:2450, units_consumed:350, reading_date:"2024-04-01" },
      { id:4, user_id:4, previous_reading:500,  current_reading:640,  units_consumed:140, reading_date:"2024-04-01" },
      { id:5, user_id:1, previous_reading:1450, current_reading:1700, units_consumed:250, reading_date:"2024-05-01" },
      { id:6, user_id:2, previous_reading:980,  current_reading:1150, units_consumed:170, reading_date:"2024-05-01" },
    ]);
  }

  if (!fs.existsSync(fp("bills"))) {
    write("bills", [
      { id:1, user_id:1, meter_reading_id:1, units_consumed:250, rate_per_unit:6.5, amount:1625, due_date:"2024-04-30", status:"paid",   bill_date:"2024-04-05" },
      { id:2, user_id:2, meter_reading_id:2, units_consumed:180, rate_per_unit:6.5, amount:1170, due_date:"2024-04-30", status:"paid",   bill_date:"2024-04-05" },
      { id:3, user_id:3, meter_reading_id:3, units_consumed:350, rate_per_unit:7.0, amount:2450, due_date:"2024-04-30", status:"unpaid", bill_date:"2024-04-05" },
      { id:4, user_id:4, meter_reading_id:4, units_consumed:140, rate_per_unit:6.5, amount:910,  due_date:"2024-04-30", status:"unpaid", bill_date:"2024-04-05" },
      { id:5, user_id:1, meter_reading_id:5, units_consumed:250, rate_per_unit:6.5, amount:1625, due_date:"2024-05-31", status:"unpaid", bill_date:"2024-05-05" },
      { id:6, user_id:2, meter_reading_id:6, units_consumed:170, rate_per_unit:6.5, amount:1105, due_date:"2024-05-31", status:"unpaid", bill_date:"2024-05-05" },
    ]);
  }

  if (!fs.existsSync(fp("payments"))) {
    write("payments", [
      { id:1, bill_id:1, user_id:1, amount:1625, payment_date:"2024-04-20", payment_mode:"UPI",        transaction_id:"TXN20240420A" },
      { id:2, bill_id:2, user_id:2, amount:1170, payment_date:"2024-04-22", payment_mode:"Net Banking", transaction_id:"TXN20240422B" },
    ]);
  }

  console.log("✅  Local JSON database ready  →  data/ folder");
}

// ── simple query API ─────────────────────────────────────────
function query(table, action = "findAll", payload = {}) {
  let rows = read(table);

  const match = (row, where = {}) =>
    Object.entries(where).every(([k, v]) => row[k] == v);

  switch (action) {
    case "findAll": {
      let result = payload.where ? rows.filter(r => match(r, payload.where)) : rows;
      if (payload.orderBy) result = [...result].sort((a, b) => a[payload.orderBy] > b[payload.orderBy] ? 1 : -1);
      return Promise.resolve([result]);
    }
    case "findOne": {
      const row = rows.find(r => match(r, payload.where || {})) ?? null;
      return Promise.resolve([[row]]);
    }
    case "insert": {
      const newRow = { id: nextId(rows), ...payload.data };
      rows.push(newRow);
      write(table, rows);
      return Promise.resolve([{ insertId: newRow.id }]);
    }
    case "update": {
      rows = rows.map(r => match(r, payload.where || {}) ? { ...r, ...payload.data } : r);
      write(table, rows);
      return Promise.resolve([{ affectedRows: 1 }]);
    }
    case "delete": {
      const before = rows.length;
      rows = rows.filter(r => !match(r, payload.where || {}));
      write(table, rows);
      return Promise.resolve([{ affectedRows: before - rows.length }]);
    }
    case "count": {
      const filtered = payload.where ? rows.filter(r => match(r, payload.where)) : rows;
      return Promise.resolve([[{ count: filtered.length }]]);
    }
    default:
      return Promise.reject(new Error(`Unknown db action: ${action}`));
  }
}

seed();
module.exports = { query, read, write, nextId };