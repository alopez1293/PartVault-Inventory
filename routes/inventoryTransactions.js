const express = require("express");
const router = express.Router();
const { requireAuth, requirePermission } = require("../auth/auth");

// Create Stock Adjustment Transaction (POST /api/inventory-transactions/adjust) -> 201 (stock.adjust)
router.post("/adjust", requireAuth, requirePermission("stock.adjust"), (req, res) => {
  res.status(201).json({
    success: true,
    message: "POST /api/inventory-transactions/adjust - Route working",
    note: "Stub: will create transaction + update inventory later",
    received: req.body,
  });
});

// List Inventory Transactions (GET /api/inventory-transactions) -> 200 (report.read)
router.get("/", requireAuth, requirePermission("report.read"), (req, res) => {
  res.status(200).json({
    success: true,
    message: "GET /api/inventory-transactions - Route working",
    data: [],
  });
});

// Get Inventory Transaction (GET /api/inventory-transactions/:id) -> 200 (report.read)
router.get("/:id", requireAuth, requirePermission("report.read"), (req, res) => {
  res.status(200).json({
    success: true,
    message: `GET /api/inventory-transactions/${req.params.id} - Route working`,
    data: { transaction_id: req.params.id },
  });
});

module.exports = router;
