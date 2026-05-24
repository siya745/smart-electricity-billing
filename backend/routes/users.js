const express = require("express");
const router = express.Router();

const consumers = [
  {
    consumer_id: 1001,
    name: "Ravi Kumar",
    address: "Hyderabad",
    phone: "9876543210",
    connection_type: "Residential"
  },
  {
    consumer_id: 1002,
    name: "Priya Sharma",
    address: "Chennai",
    phone: "9123456780",
    connection_type: "Commercial"
  },
  {
    consumer_id: 1003,
    name: "Arjun Reddy",
    address: "Bangalore",
    phone: "9988776655",
    connection_type: "Industrial"
  }
];

// GET ALL CONSUMERS
router.get("/", (req, res) => {

  res.json({
    success: true,
    data: consumers
  });

});

// GET SINGLE CONSUMER
router.get("/:id", (req, res) => {

  const consumer = consumers.find(
    c => c.consumer_id == req.params.id
  );

  if (!consumer) {
    return res.status(404).json({
      success: false,
      error: "Consumer not found"
    });
  }

  res.json({
    success: true,
    data: consumer
  });

});

// ADD CONSUMER
router.post("/", (req, res) => {

  consumers.push(req.body);

  res.json({
    success: true,
    message: "Consumer added"
  });

});

// UPDATE CONSUMER
router.put("/:id", (req, res) => {

  res.json({
    success: true,
    message: "Consumer updated"
  });

});

// DELETE CONSUMER
router.delete("/:id", (req, res) => {

  res.json({
    success: true,
    message: "Consumer deleted"
  });

});

module.exports = router;